import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, filter, debounceTime, mergeMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
// Services
import { RecipeService } from '../../../utilities/services/recipe/recipe.service';
import { UploadedImage } from '../../../utilities/services/cloudinary/uploadedImage';
// Font Awesome
import { faArrowDown, faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-recipe-create',
  templateUrl: './recipe-create.component.html',
  styleUrls: ['./recipe-create.component.scss']
})
export class RecipeCreateComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  // Font Awesome
  faArrowDown = faArrowDown;
  faTimes = faTimes;
  // Form
  createRecipeForm: FormGroup;
  submitted: boolean = false;
  descriptionCount: number;
  sendingForm: boolean = false;
  // Form error messages
  formError: string;
  ingredientError: string;
  instructionError: string;
  // Available name
  availableName: boolean;
  // image
  uploadedImage: UploadedImage;
  isImageLoading: boolean;
  isSendingDeleteToken: boolean;

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private location: Location,
    private recipeService: RecipeService
  ) { }

  ngOnInit() {
    this.createForm();
    this.onNameChanges();
    this.onDescriptionChanges();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }


  createForm() {
    this.createRecipeForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(75)]],
      description: ['', [Validators.required, Validators.maxLength(150)]],
      ingredients: this.fb.array([
        this.createIngredient()
      ]),
      instructions: this.fb.array([
        this.createInstruction()
      ]),
      cookTime: ['', [Validators.required, Validators.pattern('[0-9]*')]],
      difficulty: ['', [Validators.required, Validators.pattern('[1-5]')]],
      originalRecipeUrl: '',
      youtubeUrl: '',
      mealPic: [null],
    });
  }

  createIngredient(): FormGroup {
    return this.fb.group({
      ingredient: ['', [Validators.required]]
    });
  }

  createInstruction(): FormGroup {
    return this.fb.group({
      instruction: ['', [Validators.required]]
    });
  }

  // This gives the template easier access to the form
  get name() { return this.createRecipeForm.get('name'); }
  get description() { return this.createRecipeForm.get('description'); }
  get ingredients() { return this.createRecipeForm.get('ingredients') as FormArray; }
  get instructions() { return this.createRecipeForm.get('instructions') as FormArray; }
  get cookTime() { return this.createRecipeForm.get('cookTime'); }
  get difficulty() { return this.createRecipeForm.get('difficulty'); }
  get originalRecipeUrl() { return this.createRecipeForm.get('originalRecipeUrl'); }
  get youtubeUrl() { return this.createRecipeForm.get('youtubeUrl'); }
  get mealPic() { return this.createRecipeForm.get('mealPic'); }

  // This checks for available recipe names
  onNameChanges() {
    this.createRecipeForm.get('name').valueChanges
      .pipe(
        filter(val => val.length <= 75),
        debounceTime(500),
        mergeMap(val => this.recipeService.checkRecipeNameAvailability(val)),
        takeUntil(this.ngUnsubscribe)
      ).subscribe(res => {
        this.availableName = true;
      }, err => {
        this.availableName = false;
        // The api returns a 400 error when the username is taken.
        // Theis resubscribes to the observable because subscriptions 
        // complete on errors.
        this.onNameChanges();
      });
  }

  // This shows the amount of characters a user has used in the textarea
  // for the description
  onDescriptionChanges() {
    this.createRecipeForm.get('description').valueChanges
      .pipe(
        takeUntil(this.ngUnsubscribe)
      ).subscribe(res => {
        this.descriptionCount = res.length;
      });
  }

  // ====================
  // Ingredient Controls
  // ====================
  addIngredientInput(index): void {
    this.ingredients.insert(index + 1, this.createIngredient());
  }

  removeIngredient(index, arrayLength): void {
    if (index === 0 && arrayLength === 1) {
      this.ingredientError = 'You must have at least 1 ingredient.';
      return;
    }
    this.ingredients.removeAt(index);
  }

  clearIngredientErrorMessage() {
    this.ingredientError = '';
  }

  // ====================
  // Instructions Controls
  // ====================
  addInstructionInput(index): void {
    this.instructions.insert(index + 1, this.createInstruction());
  }

  removeInstruction(index, arrayLength): void {
    if (index === 0 && arrayLength === 1) {
      this.instructionError = 'You must have at least 1 instruction.';
      return;
    }
    this.instructions.removeAt(index);
  }

  clearInstructionErrorMessage() {
    this.instructionError = '';
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

  onSubmit() {
    // This helps show errors on the form if a user tries to submit
    // the form before completing it
    this.submitted = true;

    // Stops the form from submitting while the image is uploading
    if (this.isImageLoading) {
      return this.formError = 'You cannot submit the form while your image is loading.';
    }

    // Stops the form from submitting while the image is deleting
    if (this.isSendingDeleteToken) {
      return this.formError = 'You cannot submit the form while your image is deleting.';
    }

    // This stops the form submission if the form is invalid
    if (this.createRecipeForm.invalid || !this.availableName) {
      return;
    }

    // This is to show a loading indicator
    this.sendingForm = true;

    let recipe = {
      name: this.createRecipeForm.value.name,
      description: this.createRecipeForm.value.description,
      ingredients: this.createRecipeForm.value.ingredients,
      instructions: this.createRecipeForm.value.instructions,
      cookTime: this.createRecipeForm.value.cookTime,
      difficulty: this.createRecipeForm.value.difficulty,
      originalRecipeUrl: this.createRecipeForm.value.originalRecipeUrl,
      youtubeUrl: this.createRecipeForm.value.youtubeUrl,
      // set image property defaults
      recipePicName: null,
      publicId: null
    };

    // Add image properties to recipe object if the image has uploaded
    if (this.uploadedImage) {
      recipe.recipePicName = this.uploadedImage.secure_url;
      recipe.publicId = this.uploadedImage.public_id;
    }

    this.recipeService.createRecipe(recipe).pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe(res => {
      this.router.navigate(['/recipes', res.id]);
    }, err => {

      // This stops the loading indicator
      this.sendingForm = false;

      // This shows the error message
      this.formError = err.error.message;
    });
  }

  clearErrorMessage() {
    this.formError = '';
  }

  navigateBack() {
    this.location.back();
  }
}
