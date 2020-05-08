import {
	async,
	ComponentFixture,
	TestBed,
	tick,
	fakeAsync,
} from "@angular/core/testing";
import { RecipeEditComponent } from "./recipe-edit.component";
import { DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";
import { RecipeService } from "../../../utilities/services/recipe/recipe.service";
import { AuthService } from "../../../utilities/services/auth/auth.service";
import { Router, ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { Location } from "@angular/common";
import { of, throwError } from "rxjs";
import { RecipeModule } from "../recipe.module";
import { HttpClientTestingModule } from "@angular/common/http/testing";

function longName() {
	let string = "";
	for (let i = 0; i < 76; i++) {
		string = string + "a";
	}
	return string;
}

let fixture: ComponentFixture<RecipeEditComponent>;
let pageErrorMsg: DebugElement;
let name: DebugElement;
let nameRequired: DebugElement;
let availableName: DebugElement;
let maxlength: DebugElement;
// ingredients
let ingredientsArray;
let addIngredientArray;
let deleteIngredientArray;
let ingredientsErrorMsg: DebugElement;
let clearIngredientsErrorMsg: DebugElement;
let ingredientRequired: DebugElement;
// instructions
let instructionsArray;
let addInstructionArray;
let deleteInstructionArray;
let instructionsErrorMsg: DebugElement;
let clearInstructionsErrorMsg: DebugElement;
let instructionRequired: DebugElement;
// description
let description: DebugElement;
let descriptionCount: DebugElement;
let descriptionMaxLength: DebugElement;
// cookTime
let cookTime: DebugElement;
let cookTimeRequired: DebugElement;
let cookTimePattern: DebugElement;
// difficulty
let difficulty: DebugElement;
let difficultyRequired: DebugElement;
let difficultyPattern: DebugElement;
// originalRecipeUrl
let originalRecipeUrl: DebugElement;
// youtubeUrl
let youtubeUrl: DebugElement;
// submit button
let submitButton: DebugElement;
let errorMsg: DebugElement;
let deleteBtn: DebugElement;
// modal
let modalDelete: DebugElement;
let modalClose: DebugElement;
let modal: DebugElement;

function selectElements() {
	pageErrorMsg = fixture.debugElement.query(By.css(".message-body"));
	name = fixture.debugElement.query(By.css("#name"));
	nameRequired = fixture.debugElement.query(By.css("[data-test=nameRequired]"));
	availableName = fixture.debugElement.query(
		By.css("[data-test=nameAvailable]")
	);
	maxlength = fixture.debugElement.query(By.css("[data-test=nameMaxLength]"));
	// ingredients
	ingredientsArray = fixture.debugElement.queryAll(
		By.css("[data-test=ingredient]")
	);
	addIngredientArray = fixture.debugElement.queryAll(
		By.css("[data-test=addIngredientInput]")
	);
	deleteIngredientArray = fixture.debugElement.queryAll(
		By.css("[data-test=removeIngredient]")
	);
	ingredientsErrorMsg = fixture.debugElement.query(
		By.css("[data-test=ingredientErrorMsg]")
	);
	clearIngredientsErrorMsg = fixture.debugElement.query(
		By.css("[data-test=clearIngredientErrorMsg]")
	);
	ingredientRequired = fixture.debugElement.query(
		By.css("[data-test=ingredientRequired]")
	);
	// instructions
	instructionsArray = fixture.debugElement.queryAll(
		By.css("[data-test=instruction]")
	);
	addInstructionArray = fixture.debugElement.queryAll(
		By.css("[data-test=addInstructionInput]")
	);
	deleteInstructionArray = fixture.debugElement.queryAll(
		By.css("[data-test=removeInstruction]")
	);
	instructionsErrorMsg = fixture.debugElement.query(
		By.css("[data-test=instructionErrorMsg]")
	);
	clearInstructionsErrorMsg = fixture.debugElement.query(
		By.css("[data-test=clearInstructionErrorMsg]")
	);
	instructionRequired = fixture.debugElement.query(
		By.css("[data-test=instructionRequired]")
	);
	// description
	description = fixture.debugElement.query(By.css("[data-test=description]"));
	descriptionCount = fixture.debugElement.query(
		By.css("[data-test=descriptionCount]")
	);
	descriptionMaxLength = fixture.debugElement.query(
		By.css("[data-test=descriptionMaxLength]")
	);
	// cookTime
	cookTime = fixture.debugElement.query(By.css("[data-test=cookTime]"));
	cookTimeRequired = fixture.debugElement.query(
		By.css("[data-test=cookTimeRequired]")
	);
	cookTimePattern = fixture.debugElement.query(
		By.css("[data-test=cookTimePattern]")
	);
	// difficulty
	difficulty = fixture.debugElement.query(By.css("[data-test=difficulty]"));
	difficultyRequired = fixture.debugElement.query(
		By.css("[data-test=difficultyRequired]")
	);
	difficultyPattern = fixture.debugElement.query(
		By.css("[data-test=difficultyPattern]")
	);
	// originalRecipeUrl
	originalRecipeUrl = fixture.debugElement.query(
		By.css("[data-test=originalRecipeUrl]")
	);
	// youtubeUrl
	youtubeUrl = fixture.debugElement.query(By.css("[data-test=youtubeUrl]"));
	// submit button
	submitButton = fixture.debugElement.query(
		By.css("[data-test=submit-button]")
	);
	errorMsg = fixture.debugElement.query(By.css(".notification"));
	deleteBtn = fixture.debugElement.query(By.css("[data-test=delete-button]"));
	// modal
	modalDelete = fixture.debugElement.query(By.css("[data-test=modal-delete]"));
	modalClose = fixture.debugElement.query(By.css("[data-test=modal-close]"));
	modal = fixture.debugElement.query(By.css(".modal"));
}

const creator = {
	id: 1,
	isAdmin: true,
	username: "johndoe",
	iat: 1575496172,
	exp: 2180296172,
};

const notCreator = {
	id: 2,
	isAdmin: true,
	username: "janedoe",
	iat: 1575496172,
	exp: 2180296172,
};

const recipeObj = {
	id: 1,
	name: "Eggs and Rice",
	description: "A delicious and easy dish.",
	creatorId: 1,
	creator: {
		username: "johndoe",
		profilePic: {
			profilePicName:
				"../../../../assets/images/default-img/default-profile-pic.jpg",
		},
	},
	ingredients: ["3 eggs", "rice", "vegetables"],
	instructions: ["cooks eggs", "cook rice", "mix and serve"],
	cookTime: 20,
	difficulty: 1,
	likes: [],
	mealPic: {
		mealPicName: "../../../../assets/images/default-img/default-meal-pic.jpg",
	},
	createdAt: "Dec 04, 2019",
	updatedAt: "Dec 04, 2019",
	originalRecipeUrl: "http://www.originalrecipe.com",
	youtubeUrl: "https://www.youtube-nocookie.com/embed/MV0F_XiR48Q",
};

class MockRecipeService {
	getRecipeById(id) {
		return of();
	}
	checkRecipeNameAvailability(name) {
		return of();
	}
	editRecipe(fields, file) {
		return of();
	}
	deleteRecipe() {
		return of();
	}
}

class MockActivatedRoute {
	snapshot = { queryParams: { recipe: "1" } };
}

class MockAuthService {
	currentUser() {
		return;
	}
}

class MockLocation {
	back() {}
}

describe("RecipeEditComponent", () => {
	let component: RecipeEditComponent;
	let router: Router;
	let recipeService: RecipeService;
	let authService: AuthService;
	let route: ActivatedRoute;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [RecipeModule, RouterTestingModule, HttpClientTestingModule],
		})
			.overrideComponent(RecipeEditComponent, {
				set: {
					providers: [
						{ provide: RecipeService, useClass: MockRecipeService },
						{ provide: Location, useClass: MockLocation },
						{ provide: ActivatedRoute, useClass: MockActivatedRoute },
						{ provide: AuthService, useClass: MockAuthService },
					],
				},
			})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(RecipeEditComponent);
		component = fixture.componentInstance;
		recipeService = fixture.debugElement.injector.get(RecipeService);
		router = fixture.debugElement.injector.get(Router);
		route = fixture.debugElement.injector.get(ActivatedRoute);
		authService = fixture.debugElement.injector.get(AuthService);
	});

	describe("initialization", () => {
		beforeEach(() => {
			spyOn(component, "createForm").and.callThrough();
			spyOn(component, "onNameChanges").and.callThrough();
			spyOn(component, "onDescriptionChanges").and.callThrough();
			spyOn(recipeService, "getRecipeById").and.callFake(() => of(recipeObj));
			spyOn(component, "checkRecipeOwnerAndUpdateForm").and.callThrough();
			spyOn(component, "updateFormValues").and.callThrough();
			spyOn(authService, "currentUser").and.callFake(() => creator);
		});

		it("should create the component", () => {
			fixture.detectChanges();

			expect(component).toBeTruthy();
		});

		it("should populate the form with the recipe data", () => {
			fixture.detectChanges();

			selectElements();

			expect(component.createForm).toHaveBeenCalled();
			expect(component.onNameChanges).toHaveBeenCalled();
			expect(component.onDescriptionChanges).toHaveBeenCalled();
			expect(recipeService.getRecipeById).toHaveBeenCalled();
			expect(component.updateFormValues).toHaveBeenCalled();
			expect(component.checkRecipeOwnerAndUpdateForm).toHaveBeenCalled();
			expect(authService.currentUser).toHaveBeenCalled();

			expect(name.nativeElement.value).toEqual("Eggs and Rice");
			expect(ingredientsArray.length).toEqual(3);
			expect(instructionsArray.length).toEqual(3);
		});

		it("should not call checkRecipeNameAvailability when the form is updated", fakeAsync(() => {
			spyOn(recipeService, "checkRecipeNameAvailability");
			fixture.detectChanges();
			selectElements();
			name.nativeElement.dispatchEvent(new Event("input"));

			tick(1000);

			fixture.detectChanges();

			expect(recipeService.checkRecipeNameAvailability).not.toHaveBeenCalled();
			expect(name.nativeElement).toHaveClass("is-success");
		}));
	});

	describe("initialization errors", () => {
		it("should return an error if there is no recipe parameter in the url", () => {
			route.snapshot.queryParams.recipe = "";
			fixture.autoDetectChanges();

			selectElements();

			expect(pageErrorMsg.nativeElement.innerText).toContain(
				"There is no recipe selected to edit."
			);
		});

		it("should show an error if the user viewing the page is not the creator of the recipe", () => {
			spyOn(recipeService, "getRecipeById").and.callFake(() => of(recipeObj));
			spyOn(authService, "currentUser").and.callFake(() => notCreator);

			fixture.detectChanges();

			selectElements();
			expect(pageErrorMsg.nativeElement.innerText).toContain(
				"You do not have permission to edit this recipe."
			);
		});

		it("should show an error if the recipe id in the url is not a number", () => {
			route.snapshot.queryParams.recipe = "eggs";
			fixture.detectChanges();

			selectElements();

			expect(pageErrorMsg.nativeElement.innerText).toContain(
				"There was an error getting your recipe to edit."
			);
		});

		it("should show an error message if there was an error getting the recipe from the server", () => {
			spyOn(recipeService, "getRecipeById").and.callFake(() => {
				return throwError({
					error: {
						message: "There was an error getting the recipe.",
					},
				});
			});
			fixture.detectChanges();

			selectElements();

			expect(pageErrorMsg.nativeElement.innerText).toContain(
				"There was an error getting the recipe."
			);
		});
	});

	describe("form validation", () => {
		beforeEach(() => {
			spyOn(recipeService, "getRecipeById").and.callFake(() => of(recipeObj));
			spyOn(authService, "currentUser").and.callFake(() => creator);
			spyOn(component, "onNameChanges").and.callThrough();
			fixture.detectChanges();
			selectElements();
		});

		describe("name", () => {
			it("should be invalid when empty", () => {
				let input = component.editRecipeForm.controls["name"];

				input.setValue("");
				name.nativeElement.dispatchEvent(new Event("input"));
				fixture.detectChanges();
				selectElements();

				expect(input.errors["required"]).toBeTruthy();
				expect(nameRequired).toBeTruthy();
			});

			it("should show a success message if the name is available", fakeAsync(() => {
				let input = component.editRecipeForm.controls["name"];

				spyOn(recipeService, "checkRecipeNameAvailability").and.callFake(() => {
					// of() must hold a value or it will complete the observable
					return of("true");
				});

				input.setValue("Sandwich");
				name.nativeElement.dispatchEvent(new Event("input"));
				fixture.detectChanges();
				// This is used because the function has a 500ms wait time
				tick(1000);
				fixture.detectChanges();
				selectElements();

				expect(recipeService.checkRecipeNameAvailability).toHaveBeenCalledWith(
					"Sandwich"
				);
				expect(input.errors).toBeFalsy();

				expect(name.classes["is-success"]).toBeTruthy();
				expect(availableName).toBeTruthy();
			}));

			it("should show an error if the name is taken", fakeAsync(() => {
				let input = component.editRecipeForm.controls["name"];

				spyOn(recipeService, "checkRecipeNameAvailability").and.callFake(() => {
					return throwError({});
				});

				input.setValue("Sandwich");
				name.nativeElement.dispatchEvent(new Event("input"));
				fixture.detectChanges();
				// This is used because the function has a 500ms wait time
				tick(1000);
				fixture.detectChanges();
				selectElements();

				expect(recipeService.checkRecipeNameAvailability).toHaveBeenCalledWith(
					"Sandwich"
				);
				expect(input.errors).toBeFalsy();
				expect(name.classes["is-danger"]).toBeTruthy();
				expect(availableName).toBeFalsy();
			}));

			it("should show that a name is too long", fakeAsync(() => {
				let input = component.editRecipeForm.controls["name"];

				spyOn(recipeService, "checkRecipeNameAvailability").and.callFake(() => {
					component.availableName = false;
					return throwError({});
				});

				input.setValue(longName());
				name.nativeElement.dispatchEvent(new Event("input"));
				fixture.detectChanges();
				// This is used because the function has a 500ms wait time
				tick(1000);
				fixture.detectChanges();
				selectElements();

				expect(
					recipeService.checkRecipeNameAvailability
				).not.toHaveBeenCalled();
				expect(input.errors).toBeTruthy();
				expect(name.classes["is-danger"]).toBeTruthy();
				expect(maxlength).toBeTruthy();
			}));
		});

		describe("description", () => {
			it("should be invalid when empty and show count at 0", () => {
				let input = component.editRecipeForm.controls["description"];

				input.setValue("");
				description.nativeElement.dispatchEvent(new Event("input"));
				fixture.detectChanges();

				expect(input.errors["required"]).toBeTruthy();
				expect(descriptionCount.nativeElement.innerText).toEqual("0/150");
			});

			it("should show an error when the description is past 150 characters", () => {
				let input = component.editRecipeForm.controls["description"];

				let createValueTooLong = () => {
					let value = "";
					for (let i = 0; i < 151; i++) {
						value = value + "a";
					}
					return value;
				};
				let valueTooLong = createValueTooLong();

				input.setValue(valueTooLong);
				description.nativeElement.dispatchEvent(new Event("input"));
				fixture.detectChanges();
				selectElements();

				expect(input.errors["maxlength"]).toBeTruthy();
				expect(description.classes["is-danger"]).toBeTruthy();
				expect(descriptionCount.nativeElement.innerText).toEqual("151/150");
				expect(descriptionMaxLength).toBeTruthy();
			});

			it("should show a success when the description is under 150 characters", () => {
				let input = component.editRecipeForm.controls["description"];

				let createValue = () => {
					let value = "";
					for (let i = 0; i < 50; i++) {
						value = value + "a";
					}
					return value;
				};
				let value = createValue();

				input.setValue(value);
				description.nativeElement.dispatchEvent(new Event("input"));
				fixture.detectChanges();
				selectElements();

				expect(input.errors).toBeFalsy();
				expect(description.classes["is-success"]).toBeTruthy();
				expect(descriptionCount.nativeElement.innerText).toEqual("50/150");
				expect(descriptionMaxLength).toBeFalsy();
			});
		});

		describe("ingredients and instructions", () => {
			it("should show a message that the inputs are required when empty", () => {
				expect(ingredientsArray.length).toEqual(3);

				// delete 2nd and 3rd inputs
				deleteIngredientArray[2].nativeElement.click();
				deleteIngredientArray[1].nativeElement.click();
				deleteInstructionArray[2].nativeElement.click();
				deleteInstructionArray[1].nativeElement.click();

				fixture.detectChanges();
				selectElements();

				let ingredientInput = component.editRecipeForm.controls["ingredients"];
				let instructionInput =
					component.editRecipeForm.controls["instructions"];

				ingredientInput["controls"][0].controls["ingredient"].setValue("");
				instructionInput["controls"][0].controls["instruction"].setValue("");
				ingredientsArray[0].nativeElement.dispatchEvent(new Event("input"));
				instructionsArray[0].nativeElement.dispatchEvent(new Event("input"));

				fixture.detectChanges();
				selectElements();

				expect(
					ingredientInput["controls"][0].controls["ingredient"].errors[
						"required"
					]
				).toBeTruthy();
				expect(ingredientsArray[0].nativeElement).toHaveClass("is-danger");
				expect(ingredientRequired).toBeTruthy();
				expect(
					instructionInput["controls"][0].controls["instruction"].errors[
						"required"
					]
				).toBeTruthy();
				expect(instructionsArray[0].nativeElement).toHaveClass("is-danger");
				expect(instructionRequired).toBeTruthy();
			});

			it("should add an input when the user clicks on the down arrow button for instructions and ingredients", () => {
				expect(ingredientsArray.length).toEqual(3);

				addIngredientArray[0].nativeElement.click();
				addInstructionArray[0].nativeElement.click();

				fixture.detectChanges();
				selectElements();

				expect(ingredientsArray.length).toEqual(4);
				expect(instructionsArray.length).toEqual(4);
			});

			it("should delete an input for instructions and ingredients and show an error when the user tries to delete the last input", () => {
				expect(ingredientsArray.length).toEqual(3);

				// delete 2nd and 3rd inputs
				deleteIngredientArray[2].nativeElement.click();
				deleteIngredientArray[1].nativeElement.click();
				deleteInstructionArray[2].nativeElement.click();
				deleteInstructionArray[1].nativeElement.click();

				fixture.detectChanges();
				selectElements();

				// check there is 1 input left
				expect(ingredientsArray.length).toEqual(1);
				expect(instructionsArray.length).toEqual(1);

				// attempt to delete last input
				deleteIngredientArray[0].nativeElement.click();
				deleteInstructionArray[0].nativeElement.click();

				fixture.detectChanges();
				selectElements();

				// error message
				expect(ingredientsErrorMsg.nativeElement.innerText).toContain(
					"You must have at least 1 ingredient."
				);
				expect(instructionsErrorMsg.nativeElement.innerText).toContain(
					"You must have at least 1 instruction."
				);

				// clear error message
				clearIngredientsErrorMsg.nativeElement.click();
				clearInstructionsErrorMsg.nativeElement.click();

				fixture.detectChanges();
				selectElements();

				// check that there are no error messages
				expect(ingredientsErrorMsg).toBeFalsy();
				expect(instructionsErrorMsg).toBeFalsy();
			});
		});

		describe("cookTime", () => {
			it("should be invalid when empty", () => {
				let input = component.editRecipeForm.controls["cookTime"];

				input.setValue("");
				cookTime.nativeElement.dispatchEvent(new Event("input"));
				fixture.detectChanges();

				expect(input.errors["required"]).toEqual(true);
				expect(cookTime.nativeElement).toHaveClass("is-danger");
			});

			it("should be valid when the user inputs a number", () => {
				let input = component.editRecipeForm.controls["cookTime"];

				input.setValue("20");
				cookTime.nativeElement.dispatchEvent(new Event("input"));
				fixture.detectChanges();
				selectElements();

				expect(input.errors).toBeFalsy();
				expect(cookTime.nativeElement).toHaveClass("is-success");
				expect(cookTimeRequired).toBeFalsy();
				expect(cookTimePattern).toBeFalsy();
			});

			it("should show an error when the value is not a number", () => {
				let input = component.editRecipeForm.controls["cookTime"];

				input.setValue("a");
				cookTime.nativeElement.dispatchEvent(new Event("input"));
				fixture.detectChanges();
				selectElements();

				expect(input.errors["pattern"]).toBeTruthy();
				expect(cookTime.nativeElement).toHaveClass("is-danger");
				expect(cookTimeRequired).toBeFalsy();
				expect(cookTimePattern).toBeTruthy();
			});
		});

		describe("difficulty", () => {
			it("should be invalid when empty", () => {
				let input = component.editRecipeForm.controls["difficulty"];

				input.setValue("");
				difficulty.nativeElement.dispatchEvent(new Event("input"));
				fixture.detectChanges();
				selectElements();

				expect(input.errors["required"]).toEqual(true);
				expect(difficulty.nativeElement).toHaveClass("is-danger");
				expect(difficultyRequired).toBeTruthy();
			});

			it("should be valid when the user inputs a number between 1 and 5", () => {
				let input = component.editRecipeForm.controls["difficulty"];

				input.setValue("2");
				difficulty.nativeElement.dispatchEvent(new Event("input"));
				fixture.detectChanges();
				selectElements();

				expect(input.errors).toBeFalsy();
				expect(difficulty.nativeElement).toHaveClass("is-success");
				expect(difficultyRequired).toBeFalsy();
				expect(difficultyPattern).toBeFalsy();
			});

			it("should show an error when the value is not a number", () => {
				let input = component.editRecipeForm.controls["difficulty"];

				input.setValue("a");
				difficulty.nativeElement.dispatchEvent(new Event("input"));
				fixture.detectChanges();
				selectElements();

				expect(input.errors["pattern"]).toBeTruthy();
				expect(difficulty.nativeElement).toHaveClass("is-danger");
				expect(difficultyRequired).toBeFalsy();
				expect(difficultyPattern).toBeTruthy();
			});

			it("should show an error when the value is not 1 - 5", () => {
				let input = component.editRecipeForm.controls["difficulty"];

				input.setValue("6");
				difficulty.nativeElement.dispatchEvent(new Event("input"));
				fixture.detectChanges();
				selectElements();

				expect(input.errors["pattern"]).toBeTruthy();
				expect(difficulty.nativeElement).toHaveClass("is-danger");
				expect(difficultyRequired).toBeFalsy();
				expect(difficultyPattern).toBeTruthy();
			});
		});

		describe("originalRecipeUrl", () => {
			it("should be valid when empty", () => {
				let input = component.editRecipeForm.controls["originalRecipeUrl"];

				input.setValue("");
				originalRecipeUrl.nativeElement.dispatchEvent(new Event("input"));
				fixture.detectChanges();

				expect(input.status).toEqual("VALID");
			});

			it("should show a success message when the user inputs a string", () => {
				let input = component.editRecipeForm.controls["originalRecipeUrl"];

				input.setValue("www.recipe.com");
				originalRecipeUrl.nativeElement.dispatchEvent(new Event("input"));
				fixture.detectChanges();

				expect(originalRecipeUrl.nativeElement).toHaveClass("is-success");
				expect(input.status).toEqual("VALID");
			});
		});

		describe("youtubeUrl", () => {
			it("should be valid when empty", () => {
				let input = component.editRecipeForm.controls["youtubeUrl"];

				input.setValue("");
				youtubeUrl.nativeElement.dispatchEvent(new Event("input"));
				fixture.detectChanges();

				expect(input.status).toEqual("VALID");
			});

			it("should show a success message when the user inputs a string", () => {
				let input = component.editRecipeForm.controls["youtubeUrl"];

				input.setValue("www.youtube.com/recipe");
				youtubeUrl.nativeElement.dispatchEvent(new Event("input"));
				fixture.detectChanges();

				expect(youtubeUrl.nativeElement).toHaveClass("is-success");
				expect(input.status).toEqual("VALID");
			});
		});
	});

	describe("submit", () => {
		beforeEach(() => {
			spyOn(recipeService, "getRecipeById").and.callFake(() => of(recipeObj));
			spyOn(authService, "currentUser").and.callFake(() => creator);
			spyOn(component, "onNameChanges").and.callThrough();
			fixture.detectChanges();
			selectElements();
		});

		it("should submit with valid credentials", () => {
			let form = component.editRecipeForm.controls;

			spyOn(recipeService, "editRecipe").and.callFake(() => {
				return of({
					id: 1,
					message: "Recipe successfully updated.",
				});
			});
			spyOn(router, "navigate");

			// set form values
			form.name.setValue("Sandwich");
			form.description.setValue("A simple meat and cheese sandwich.");
			form.ingredients["controls"][0].controls["ingredient"].setValue(
				"1 slice of ham"
			);
			form.instructions["controls"][0].controls["instruction"].setValue(
				"Put ham between bread."
			);
			form.cookTime.setValue("20");
			form.difficulty.setValue("1");

			// this makes the name input valid
			// this was already tested in the name testing suite
			// so we will just change the value this way
			component.availableName = true;

			// check that there should not be any errors
			expect(component.editRecipeForm.errors).toBeFalsy();

			submitButton.nativeElement.click();
			fixture.detectChanges();
			expect(recipeService.editRecipe).toHaveBeenCalled();
			expect(router.navigate).toHaveBeenCalledWith(["/recipes", 1]);
		});

		it("should not submit while the image is uploading", () => {
			let form = component.editRecipeForm.controls;

			spyOn(recipeService, "editRecipe");
			spyOn(router, "navigate");

			// set form values
			form.name.setValue("Sandwich");
			form.description.setValue("A simple meat and cheese sandwich.");
			form.ingredients["controls"][0].controls["ingredient"].setValue(
				"1 slice of ham"
			);
			form.instructions["controls"][0].controls["instruction"].setValue(
				"Put ham between bread."
			);
			form.cookTime.setValue("20");
			form.difficulty.setValue("1");

			// this makes the name input valid
			// this was already tested in the name testing suite
			// so we will just change the value this way
			component.availableName = true;

			component.isImageLoading = true;

			// check that there should not be any errors
			expect(component.editRecipeForm.errors).toBeFalsy();

			submitButton.nativeElement.click();
			fixture.detectChanges();
			selectElements();

			expect(recipeService.editRecipe).not.toHaveBeenCalled();
			expect(router.navigate).not.toHaveBeenCalled();
			expect(errorMsg.nativeElement.innerText).toContain(
				"You cannot submit the form while your image is loading."
			);
		});

		it("should not submit while the image is deleting", () => {
			let form = component.editRecipeForm.controls;

			spyOn(recipeService, "editRecipe");
			spyOn(router, "navigate");

			// set form values
			form.name.setValue("Sandwich");
			form.description.setValue("A simple meat and cheese sandwich.");
			form.ingredients["controls"][0].controls["ingredient"].setValue(
				"1 slice of ham"
			);
			form.instructions["controls"][0].controls["instruction"].setValue(
				"Put ham between bread."
			);
			form.cookTime.setValue("20");
			form.difficulty.setValue("1");

			// this makes the name input valid
			// this was already tested in the name testing suite
			// so we will just change the value this way
			component.availableName = true;

			component.isSendingDeleteToken = true;

			// check that there should not be any errors
			expect(component.editRecipeForm.errors).toBeFalsy();

			submitButton.nativeElement.click();
			fixture.detectChanges();
			selectElements();

			expect(recipeService.editRecipe).not.toHaveBeenCalled();
			expect(router.navigate).not.toHaveBeenCalled();
			expect(errorMsg.nativeElement.innerText).toContain(
				"You cannot submit the form while your image is deleting."
			);
		});

		it("should return an error when there is a server error", () => {
			let form = component.editRecipeForm.controls;

			spyOn(recipeService, "editRecipe").and.callFake(() => {
				return throwError({
					error: {
						message: "There was an error updating your recipe.",
					},
				});
			});
			spyOn(router, "navigate");

			// set form values
			form.name.setValue("Sandwich");
			form.description.setValue("A simple meat and cheese sandwich.");
			form.ingredients["controls"][0].controls["ingredient"].setValue(
				"1 slice of ham"
			);
			form.instructions["controls"][0].controls["instruction"].setValue(
				"Put ham between bread."
			);
			form.cookTime.setValue("20");
			form.difficulty.setValue("1");

			// this makes the name input valid
			// this was already tested in the name testing suite
			// so we will just change the value this way
			component.availableName = true;

			// check that there should not be any errors
			expect(component.editRecipeForm.errors).toBeFalsy();

			submitButton.nativeElement.click();
			fixture.detectChanges();
			selectElements();
			expect(recipeService.editRecipe).toHaveBeenCalled();
			expect(router.navigate).not.toHaveBeenCalled();

			// show notification error
			expect(errorMsg.nativeElement.innerText).toEqual(
				"There was an error updating your recipe."
			);
		});
	});

	describe("deleteRecipe", () => {
		beforeEach(() => {
			spyOn(recipeService, "getRecipeById").and.callFake(() => of(recipeObj));
			spyOn(authService, "currentUser").and.callFake(() => creator);
			fixture.detectChanges();
			selectElements();
		});

		it("should open the modal when clicking on the delete button and close when clicking the x", () => {
			deleteBtn.nativeElement.click();
			fixture.detectChanges();

			expect(component.isModalOpen).toEqual(true);
			expect(modal.classes["is-active"]).toEqual(true);

			modalClose.nativeElement.click();
			fixture.detectChanges();

			expect(component.isModalOpen).toEqual(false);
			expect(modal.classes["is-active"]).toEqual(false);
		});

		it("should not open the modal when the image is uploading", () => {
			component.isImageLoading = true;

			deleteBtn.nativeElement.click();
			fixture.detectChanges();
			selectElements();

			expect(component.isModalOpen).toBeFalsy();
			expect(modal.classes["is-active"]).toEqual(false);
			expect(errorMsg.nativeElement.innerText).toContain(
				"You cannot delete your recipe while your image is loading."
			);
		});

		it("should not open the modal when the image is deleting", () => {
			component.isSendingDeleteToken = true;

			deleteBtn.nativeElement.click();
			fixture.detectChanges();
			selectElements();

			expect(component.isModalOpen).toBeFalsy();
			expect(modal.classes["is-active"]).toEqual(false);
			expect(errorMsg.nativeElement.innerText).toContain(
				"You cannot delete your recipe while your image is deleting."
			);
		});

		it("should navigate to the landing page when successfully deleting the profile", () => {
			spyOn(component, "deleteRecipe").and.callThrough();
			spyOn(recipeService, "deleteRecipe").and.callFake(() => {
				return of({ message: "Recipe successfully deleted." });
			});
			spyOn(router, "navigate");

			deleteBtn.nativeElement.click();
			fixture.detectChanges();

			modalDelete.nativeElement.click();
			fixture.detectChanges();

			expect(component.deleteRecipe).toHaveBeenCalled();
			expect(recipeService.deleteRecipe).toHaveBeenCalled();
			expect(router.navigate).toHaveBeenCalledWith(["/recipes"]);

			// close the modal in the testing window
			modalClose.nativeElement.click();
			fixture.detectChanges();
		});

		it("should show an error message on error", () => {
			spyOn(component, "deleteRecipe").and.callThrough();
			spyOn(recipeService, "deleteRecipe").and.callFake(() => {
				return throwError({
					error: {
						message: "There was an error deleting your recipe.",
					},
				});
			});
			spyOn(router, "navigate");

			deleteBtn.nativeElement.click();
			fixture.detectChanges();

			modalDelete.nativeElement.click();
			fixture.detectChanges();
			selectElements();

			expect(component.deleteRecipe).toHaveBeenCalled();
			expect(recipeService.deleteRecipe).toHaveBeenCalled();
			expect(router.navigate).not.toHaveBeenCalled();
			expect(errorMsg.nativeElement.innerText).toEqual(
				"There was an error deleting your recipe."
			);
		});
	});
});
