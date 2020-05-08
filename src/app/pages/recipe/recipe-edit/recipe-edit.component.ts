import { Component, OnInit, OnDestroy } from "@angular/core";
import { Location } from "@angular/common";
import { Subject, of } from "rxjs";
import { takeUntil, filter, debounceTime, switchMap } from "rxjs/operators";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
// Services
import { RecipeService } from "../../../utilities/services/recipe/recipe.service";
import { Recipe } from "../../../utilities/interfaces/recipe";
import { AuthService } from "../../../utilities/services/auth/auth.service";
import { UploadedImage } from "../../../utilities/interfaces/uploadedImage";
// Font Awesome
import { faArrowDown, faTimes } from "@fortawesome/free-solid-svg-icons";
// Environment
import { environment } from "../../../../environments/environment";

@Component({
	selector: "app-recipe-edit",
	templateUrl: "./recipe-edit.component.html",
	styleUrls: ["./recipe-edit.component.scss"],
})
export class RecipeEditComponent implements OnInit, OnDestroy {
	private ngUnsubscribe = new Subject();
	apiUrl = environment.apiUrl;
	// Font Awesome
	faArrowDown = faArrowDown;
	faTimes = faTimes;
	// Page
	recipeParam: string;
	loading: boolean;
	pageError: string;
	// Recipe
	recipe: Recipe;
	// Form
	editRecipeForm: FormGroup;
	submitted: boolean = false;
	descriptionCount: number;
	sendingForm: boolean = false;
	// Form error messages
	formError: string;
	ingredientError: string;
	instructionError: string;
	// Available name
	availableName: boolean;
	// =======
	isModalOpen: boolean;
	isDeleting: boolean;
	deleteError: string;
	// image
	uploadedImage: UploadedImage;
	isImageLoading: boolean;
	isSendingDeleteToken: boolean;

	constructor(
		private route: ActivatedRoute,
		private fb: FormBuilder,
		private router: Router,
		private recipeService: RecipeService,
		private location: Location,
		private authService: AuthService
	) {}

	ngOnInit() {
		this.recipeParam = this.route.snapshot.queryParams["recipe"];

		if (!this.recipeParam) {
			return (this.pageError = "There is no recipe selected to edit.");
		}

		this.createForm();

		// if 'recipeParam' is a number(id), it will return the number
		// and be a truthy value. If the value is a string(name), it will
		// return NaN and be a falsy value.
		// The way to get to the edit page is to click on the edit button
		// in the recipe view page. That edit button sends the id of the recipe
		if (Number(this.recipeParam)) {
			this.getRecipeById(this.recipeParam);
		} else {
			return (this.pageError =
				"There was an error getting your recipe to edit.");
		}

		// Listen for changes in the form
		this.onNameChanges();
		this.onDescriptionChanges();
	}

	ngOnDestroy() {
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}

	// ===========================================
	// Get recipe
	// ===========================================
	getRecipeById(id) {
		this.loading = true;

		this.recipeService
			.getRecipeById(id)
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe(
				res => {
					this.loading = false;

					this.recipe = res;

					this.checkRecipeOwnerAndUpdateForm(this.recipe);
				},
				err => {
					this.loading = false;

					// This shows the error message
					this.pageError = err.error.message;
				}
			);
	}

	checkRecipeOwnerAndUpdateForm(recipe: Recipe) {
		if (this.authService.currentUser().id !== recipe.creatorId) {
			this.pageError = "You do not have permission to edit this recipe.";
		} else {
			this.updateFormValues(recipe);
		}
	}

	// ===========================================
	// Form creation
	// ===========================================
	createForm() {
		this.editRecipeForm = this.fb.group({
			name: ["", [Validators.required, Validators.maxLength(75)]],
			description: ["", [Validators.required, Validators.maxLength(150)]],
			ingredients: this.fb.array([this.createIngredient()]),
			instructions: this.fb.array([this.createInstruction()]),
			cookTime: ["", [Validators.required, Validators.pattern("[0-9]*")]],
			difficulty: ["", [Validators.required, Validators.pattern("[1-5]")]],
			originalRecipeUrl: "",
			youtubeUrl: "",
			mealPic: [null],
		});
	}

	// This creates an individual ingredient input
	createIngredient(): FormGroup {
		return this.fb.group({
			ingredient: ["", [Validators.required]],
		});
	}

	addIngredientInput(index): void {
		this.ingredients.insert(index + 1, this.createIngredient());
	}

	removeIngredient(index, arrayLength): void {
		if (index === 0 && arrayLength === 1) {
			this.ingredientError = "You must have at least 1 ingredient.";
			return;
		}
		this.ingredients.removeAt(index);
	}

	clearIngredientErrorMessage(): void {
		this.ingredientError = "";
	}

	// This creates an instruction ingredient input
	createInstruction(): FormGroup {
		return this.fb.group({
			instruction: ["", [Validators.required]],
		});
	}

	addInstructionInput(index): void {
		this.instructions.insert(index + 1, this.createInstruction());
	}

	removeInstruction(index, arrayLength): void {
		if (index === 0 && arrayLength === 1) {
			this.instructionError = "You must have at least 1 instruction.";
			return;
		}
		this.instructions.removeAt(index);
	}

	clearInstructionErrorMessage(): void {
		this.instructionError = "";
	}

	// This gives the template easier access to the form
	get name() {
		return this.editRecipeForm.get("name");
	}
	get description() {
		return this.editRecipeForm.get("description");
	}
	get ingredients() {
		return this.editRecipeForm.get("ingredients") as FormArray;
	}
	get instructions() {
		return this.editRecipeForm.get("instructions") as FormArray;
	}
	get cookTime() {
		return this.editRecipeForm.get("cookTime");
	}
	get difficulty() {
		return this.editRecipeForm.get("difficulty");
	}
	get originalRecipeUrl() {
		return this.editRecipeForm.get("originalRecipeUrl");
	}
	get youtubeUrl() {
		return this.editRecipeForm.get("youtubeUrl");
	}
	get mealPic() {
		return this.editRecipeForm.get("mealPic");
	}

	clearErrorMessage() {
		this.formError = "";
	}

	// ===========================================
	// Form changes
	// ===========================================

	// This checks for available recipe names
	onNameChanges() {
		this.editRecipeForm
			.get("name")
			.valueChanges.pipe(
				filter(val => val.length <= 75),
				debounceTime(500),
				switchMap(val => {
					// Checks if the name in the input is the same as the name of the recipe and
					// marks it as available. If the function calls checkRecipeNameAvailability, then
					// the name will come back as unavailable. It should show the user that the name is available because
					// updating the recipe with the same name is acceptable
					if (this.recipe.name.toLowerCase() !== val.toLowerCase()) {
						return this.recipeService.checkRecipeNameAvailability(val);
					} else {
						// this must still call a successful response to mark availableName as true.
						// the string, 'false', is not used and only there to show that this is the false result
						return of("false");
					}
				}),
				takeUntil(this.ngUnsubscribe)
			)
			.subscribe(
				res => {
					this.availableName = true;
				},
				err => {
					this.availableName = false;
					// The api returns a 400 error when the name is taken.
					// This resubscribes to the observable because subscriptions
					// complete on errors.
					this.onNameChanges();
				}
			);
	}

	// This shows the amount of characters a user has used in the textarea
	// for the description
	onDescriptionChanges() {
		this.editRecipeForm
			.get("description")
			.valueChanges.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe(res => {
				this.descriptionCount = res.length;
			});
	}

	// ===========================================
	// Update form when recipe is loaded
	// ===========================================
	updateFormValues(recipe: Recipe) {
		this.editRecipeForm.get("name").setValue(recipe.name);
		this.editRecipeForm.get("description").setValue(recipe.description);
		this.updateIngredients(recipe.ingredients);
		this.updateInstructions(recipe.instructions);
		this.editRecipeForm.get("cookTime").setValue(recipe.cookTime);
		this.editRecipeForm.get("difficulty").setValue(recipe.difficulty);
		this.editRecipeForm
			.get("originalRecipeUrl")
			.setValue(recipe.originalRecipeUrl);
		this.editRecipeForm
			.get("youtubeUrl")
			.setValue(this.formatYoutubeUrl(recipe.youtubeUrl));
	}

	formatYoutubeUrl(youtubeUrl: string) {
		if (youtubeUrl)
			return youtubeUrl.replace(
				"https://www.youtube-nocookie.com/embed/",
				"https://youtu.be/"
			);
	}

	updateIngredients(ingredients) {
		for (let i = 0; i < ingredients.length; i++) {
			if (i === 0) {
				this.ingredients
					.at(i)
					["controls"]["ingredient"].setValue(ingredients[i]);
			} else {
				this.ingredients.push(
					this.fb.group({
						ingredient: [ingredients[i], [Validators.required]],
					})
				);
			}
		}
	}

	updateInstructions(instructions) {
		for (let i = 0; i < instructions.length; i++) {
			if (i === 0) {
				this.instructions
					.at(i)
					["controls"]["instruction"].setValue(instructions[i]);
			} else {
				this.instructions.push(
					this.fb.group({
						instruction: [instructions[i], [Validators.required]],
					})
				);
			}
		}
	}

	// ===========================================
	// File upload
	// ===========================================
	onImageUpload(uploadedImage: UploadedImage) {
		this.uploadedImage = uploadedImage;
	}

	onImageLoading(isImageLoading: boolean) {
		this.isImageLoading = isImageLoading;
	}

	onImageDelete(isSendingDeleteToken: boolean) {
		this.isSendingDeleteToken = isSendingDeleteToken;
	}

	// ===========================================
	// Submit form
	// ===========================================
	onSubmit() {
		// This helps show errors on the form if a user tries to submit
		// the form before completing it
		this.submitted = true;

		// Stops the form from submitting while the image is uploading
		if (this.isImageLoading) {
			return (this.formError =
				"You cannot submit the form while your image is loading.");
		}

		// Stops the form from submitting while the image is deleting
		if (this.isSendingDeleteToken) {
			return (this.formError =
				"You cannot submit the form while your image is deleting.");
		}

		// This stops the form submission if the form is invalid
		if (this.editRecipeForm.invalid || !this.availableName) {
			return;
		}

		// This is to show a loading indicator
		this.sendingForm = true;

		let recipe = {
			id: this.recipe.id,
			name: this.editRecipeForm.value.name,
			description: this.editRecipeForm.value.description,
			ingredients: this.editRecipeForm.value.ingredients,
			instructions: this.editRecipeForm.value.instructions,
			cookTime: this.editRecipeForm.value.cookTime,
			difficulty: this.editRecipeForm.value.difficulty,
			originalRecipeUrl: this.editRecipeForm.value.originalRecipeUrl,
			youtubeUrl: this.editRecipeForm.value.youtubeUrl,
			// set image property defaults
			recipePicName: null,
			publicId: null,
		};

		// Add image properties to recipe object if the image has uploaded
		if (this.uploadedImage) {
			recipe.recipePicName = this.uploadedImage.secure_url;
			recipe.publicId = this.uploadedImage.public_id;
		}

		this.recipeService
			.editRecipe(recipe)
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe(
				res => {
					this.router.navigate(["/recipes", res.id]);
				},
				err => {
					// This stops the loading indicator
					this.sendingForm = false;

					// This shows the error message
					this.formError = err.error.message;
				}
			);
	}

	// ===========================================
	// Page functions
	// ===========================================
	navigateBack() {
		this.location.back();
	}

	// ===========================================
	// Delete functions
	// ===========================================
	toggleModal() {
		// Stops the form from submitting while the image is uploading
		if (this.isImageLoading) {
			return (this.formError =
				"You cannot delete your recipe while your image is loading.");
		}

		// Stops the form from submitting while the image is deleting
		if (this.isSendingDeleteToken) {
			return (this.formError =
				"You cannot delete your recipe while your image is deleting.");
		}

		this.isModalOpen = !this.isModalOpen;
	}

	deleteRecipe() {
		// Stops the form from submitting while the image is uploading
		if (this.isImageLoading) {
			return (this.formError =
				"You cannot delete your recipe while your image is loading.");
		}

		// Stops the form from submitting while the image is deleting
		if (this.isSendingDeleteToken) {
			return (this.formError =
				"You cannot delete your recipe while your image is deleting.");
		}

		this.isDeleting = true;
		this.recipeService.deleteRecipe(this.recipe.id).subscribe(
			res => {
				this.isDeleting = false;
				this.router.navigate(["/recipes"]);
			},
			err => {
				this.isDeleting = false;
				this.isModalOpen = false;
				this.deleteError = err.error.message;
			}
		);
	}

	clearDeleteErrorMessage() {
		this.deleteError = "";
	}
}
