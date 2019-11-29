import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { RecipeModule } from '../recipe.module';
import { RecipeCreateComponent } from './recipe-create.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RecipeService } from '../../../utilities/services/recipe/recipe.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { of, throwError } from 'rxjs';


let fixture: ComponentFixture<RecipeCreateComponent>;
let name: DebugElement;
let description: DebugElement;
let descriptionCount: DebugElement;
let ingredients: DebugElement;
let addIngredientInput: DebugElement;
let removeIngredient: DebugElement;
let instructions: DebugElement;
let addInstructionInput: DebugElement;
let removeInstruction: DebugElement;
let cookTime: DebugElement;
let difficulty: DebugElement;
let originalRecipeUrl: DebugElement;
let youtubeUrl: DebugElement;
let submitButton: DebugElement;

function selectElements() {
  name = fixture.debugElement.query(By.css('[data-test=name]'));
  description = fixture.debugElement.query(By.css('[data-test=description]'));
  descriptionCount = fixture.debugElement.query(By.css('[data-test=descriptionCount]'));
  ingredients = fixture.debugElement.query(By.css('[data-test=ingredient]'));
  addIngredientInput = fixture.debugElement.query(By.css('[data-test=addIngredientInput]'));
  removeIngredient = fixture.debugElement.query(By.css('[data-test=removeIngredient]'));
  instructions = fixture.debugElement.query(By.css('[data-test=instruction]'));
  addInstructionInput = fixture.debugElement.query(By.css('[data-test=addInstructionInput]'));
  removeInstruction = fixture.debugElement.query(By.css('[data-test=removeInstruction]'));
  cookTime = fixture.debugElement.query(By.css('[data-test=cookTime]'));
  difficulty = fixture.debugElement.query(By.css('[data-test=difficulty]'));
  originalRecipeUrl = fixture.debugElement.query(By.css('[data-test=originalRecipeUrl]'));
  youtubeUrl = fixture.debugElement.query(By.css('[data-test=youtubeUrl]'));
  submitButton = fixture.debugElement.query(By.css('[data-test=submit-button]'));
}

class MockRecipeService {
  checkRecipeNameAvailability(name) {}
  createRecipe(recipe, file) {}
}

class MockRouter {
  navigate(path) {}
}

class MockLocation {
  back() {}
}

describe('RecipeCreateComponent', () => {
  let component: RecipeCreateComponent;
  let router: Router;
  let recipeService: RecipeService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RecipeModule]
    })
    .overrideComponent(RecipeCreateComponent, {
      set: {
        providers: [
          { provide: RecipeService, useClass: MockRecipeService },
          { provide: Router, useClass: MockRouter },
          { provide: Location, useClass: MockLocation }
        ]
      }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeCreateComponent);
    component = fixture.componentInstance;
    recipeService = fixture.debugElement.injector.get(RecipeService);
    router = fixture.debugElement.injector.get(Router);
    fixture.detectChanges();
    selectElements();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Create recipe form', () => {
    it('should be invalid when empty', () => {
      expect(component.createRecipeForm.valid).toBeFalsy();
    });

    describe('name', () => {
      it('should be invalid when empty', () => {
        let input = component.createRecipeForm.controls['name'];
        expect(input.errors['required']).toBeTruthy();
      });

      it('should show an error when the input is touched but empty', () => {
        let input = component.createRecipeForm.controls['name'];
  
        input.setValue("");
        name.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        let nameRequired = fixture.debugElement.query(By.css('[data-test=nameRequired]'));
        expect(input.errors['required']).toBeTruthy();
        expect(name.classes['is-danger']).toBeTruthy();
        expect(nameRequired).toBeTruthy();
      });

      it('should show a success message if the name is available', fakeAsync(() => {
        let input = component.createRecipeForm.controls['name'];

        spyOn(recipeService, 'checkRecipeNameAvailability').and.callFake(() => {
          component.availableName = true;
          return of();
        });


        input.setValue('Sandwich');
        name.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        // This is used because the function has a 500ms wait time
        tick(1000);
        fixture.detectChanges();
        expect(recipeService.checkRecipeNameAvailability).toHaveBeenCalledWith('Sandwich');
        expect(input.errors).toBeFalsy();
        let availableName = fixture.debugElement.query(By.css('[data-test=nameAvailable]'));
        expect(name.classes['is-success']).toBeTruthy();
        expect(availableName).toBeTruthy();
      }));

      it('should show an error if the name is taken', fakeAsync(() => {
        let input = component.createRecipeForm.controls['name'];

        spyOn(recipeService, 'checkRecipeNameAvailability').and.callFake(() => {
          component.availableName = false;
          return throwError({});
        });

        input.setValue('Sandwich');
        name.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        // This is used because the function has a 500ms wait time
        tick(1000);
        fixture.detectChanges();
        expect(recipeService.checkRecipeNameAvailability).toHaveBeenCalledWith('Sandwich');
        expect(input.errors).toBeFalsy();
        let availableName = fixture.debugElement.query(By.css('[data-test=nameUnavailable]'));
        expect(name.classes['is-danger']).toBeTruthy();
        expect(availableName).toBeTruthy();
      }));
    });

    describe('description', () => {
      it('should be invalid when empty', () => {
        let input = component.createRecipeForm.controls['description'];
        expect(input.errors['required']).toBeTruthy();
      });

      it('should be invalid when empty', () => {
        let input = component.createRecipeForm.controls['description'];
        expect(input.errors['required']).toBeTruthy();
      });

      it('should initialize with the character count set to 0', () => {
        expect(descriptionCount.nativeElement.innerText).toEqual('0/150');
      });

      it('should show an error when the input is touched but empty', () => {
        let input = component.createRecipeForm.controls['description'];
  
        input.setValue("");
        description.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        let descriptionRequired = fixture.debugElement.query(By.css('[data-test=descriptionRequired]'));
        expect(input.errors['required']).toBeTruthy();
        expect(description.classes['is-danger']).toBeTruthy();
        expect(descriptionRequired).toBeTruthy();
      });

      it('should show an error when the description is past 150 characters', () => {
        let input = component.createRecipeForm.controls['description'];
  
        let createValueTooLong = () => {
          let value = '';
          for (let i = 0; i < 151; i++) {
            value = value + 'a';
          }
          return value;
        }
        let valueTooLong = createValueTooLong();

        input.setValue(valueTooLong);
        description.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        let descriptionMaxLength = fixture.debugElement.query(By.css('[data-test=descriptionMaxLength]'));
        expect(input.errors['maxlength']).toBeTruthy();
        expect(description.classes['is-danger']).toBeTruthy();
        expect(descriptionCount.nativeElement.innerText).toEqual('151/150');
        expect(descriptionMaxLength).toBeTruthy();
      });

      it('should show a success when the description is under 150 characters', () => {
        let input = component.createRecipeForm.controls['description'];
  
        let createValue = () => {
          let value = '';
          for (let i = 0; i < 50; i++) {
            value = value + 'a';
          }
          return value;
        }
        let value = createValue();

        input.setValue(value);
        description.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        let descriptionMaxLength = fixture.debugElement.query(By.css('[data-test=descriptionMaxLength]'));
        expect(input.errors).toBeFalsy();
        expect(description.classes['is-success']).toBeTruthy();
        expect(descriptionCount.nativeElement.innerText).toEqual('50/150');
        expect(descriptionMaxLength).toBeFalsy();
      });
    });

    describe('ingredients', () => {
      it('should be invalid when empty', () => {
        let input = component.createRecipeForm.controls['ingredients'];
        expect(input['controls'][0].controls['ingredient'].errors['required']).toEqual(true);
      });

      it('should show an error when the input is touched but empty', () => {
        let input = component.createRecipeForm.controls['ingredients'];

        input['controls'][0].controls['ingredient'].setValue('');
        ingredients.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        let ingredientRequired = fixture.debugElement.query(By.css('[data-test=ingredientRequired]'));

        expect(input['controls'][0].controls['ingredient'].errors['required']).toBeTruthy();
        expect(ingredients.nativeElement).toHaveClass('is-danger');
        expect(ingredientRequired).toBeTruthy();
      });

      it('should be valid when an ingredient is added', () => {
        let input = component.createRecipeForm.controls['ingredients'];

        input['controls'][0].controls['ingredient'].setValue('1 slice of ham');
        ingredients.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(input['controls'][0].controls['ingredient'].errors).toBeFalsy();
        expect(ingredients.nativeElement).toHaveClass('is-success');
      });

      it('should add an input when the user clicks the down arrow button on the first ingredient row', () => {
        addIngredientInput.nativeElement.click();
        fixture.detectChanges();

        let ingredientRows = fixture.debugElement.queryAllNodes(By.css('[data-test=ingredient]'));

        expect(ingredientRows.length).toEqual(2);
      });

      it('should show an error message when a user tries to delete the only ingredient row', () => {
        removeIngredient.nativeElement.click();
        fixture.detectChanges();

        let ingredientErrorMsg = fixture.debugElement.query(By.css('[data-test=ingredientErrorMsg]'));

        expect(ingredientErrorMsg.nativeElement.innerText).toEqual('You must have at least 1 ingredient.');
      });

      it('should delete a row when the user clicks the delete row button', () => {
        addIngredientInput.nativeElement.click();
        fixture.detectChanges();

        let ingredientRows = fixture.debugElement.queryAllNodes(By.css('[data-test=ingredient]'));

        expect(ingredientRows.length).toEqual(2);

        removeIngredient.nativeElement.click();
        fixture.detectChanges();

        ingredientRows = fixture.debugElement.queryAllNodes(By.css('[data-test=ingredient]'));

        expect(ingredientRows.length).toEqual(1);
      });
    });

    describe('instructions', () => {
      it('should be invalid when empty', () => {
        let input = component.createRecipeForm.controls['instructions'];
        expect(input['controls'][0].controls['instruction'].errors['required']).toEqual(true);
      });

      it('should show an error when the input is touched but empty', () => {
        let input = component.createRecipeForm.controls['instructions'];

        input['controls'][0].controls['instruction'].setValue('');
        instructions.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        let instructionRequired = fixture.debugElement.query(By.css('[data-test=instructionRequired]'));

        expect(input['controls'][0].controls['instruction'].errors['required']).toBeTruthy();
        expect(instructions.nativeElement).toHaveClass('is-danger');
        expect(instructionRequired).toBeTruthy();
      });

      it('should be valid when an instruction is added', () => {
        let input = component.createRecipeForm.controls['instructions'];

        input['controls'][0].controls['instruction'].setValue('Put ham between 2 slices of bread.');
        instructions.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(input['controls'][0].controls['instruction'].errors).toBeFalsy();
        expect(instructions.nativeElement).toHaveClass('is-success');
      });

      it('should add an input when the user clicks the down arrow button on the first instruction row', () => {
        addInstructionInput.nativeElement.click();
        fixture.detectChanges();

        let instructionRows = fixture.debugElement.queryAllNodes(By.css('[data-test=instruction]'));

        expect(instructionRows.length).toEqual(2);
      });

      it('should show an error message when a user tries to delete the only ingredient row', () => {
        removeInstruction.nativeElement.click();
        fixture.detectChanges();

        let instructionErrorMsg = fixture.debugElement.query(By.css('[data-test=instructionErrorMsg]'));

        expect(instructionErrorMsg.nativeElement.innerText).toEqual('You must have at least 1 instruction.');
      });

      it('should delete a row when the user clicks the delete row button', () => {
        addInstructionInput.nativeElement.click();
        fixture.detectChanges();

        let instructionRows = fixture.debugElement.queryAllNodes(By.css('[data-test=instruction]'));

        expect(instructionRows.length).toEqual(2);

        removeInstruction.nativeElement.click();
        fixture.detectChanges();

        instructionRows = fixture.debugElement.queryAllNodes(By.css('[data-test=instruction]'));

        expect(instructionRows.length).toEqual(1);
      });
    });

    describe('cookTime', () => {
      it('should be invalid when empty', () => {
        let input = component.createRecipeForm.controls['cookTime'];

        expect(input.errors['required']).toEqual(true);
      });

      it('should show an error when the input is touched but empty', () => {
        let input = component.createRecipeForm.controls['cookTime'];

        input.setValue('');
        cookTime.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        let cookTimeRequired = fixture.debugElement.query(By.css('[data-test=cookTimeRequired]'));

        expect(input.errors['required']).toBeTruthy();
        expect(cookTime.nativeElement).toHaveClass('is-danger');
        expect(cookTimeRequired).toBeTruthy();
      });

      it('should be valid when the user inputs a number', () => {
        let input = component.createRecipeForm.controls['cookTime'];

        input.setValue('20');
        cookTime.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        let cookTimeRequired = fixture.debugElement.query(By.css('[data-test=cookTimeRequired]'));
        let cookTimePattern = fixture.debugElement.query(By.css('[data-test=cookTimePattern]'));

        expect(input.errors).toBeFalsy();
        expect(cookTime.nativeElement).toHaveClass('is-success');
        expect(cookTimeRequired).toBeFalsy();
        expect(cookTimePattern).toBeFalsy();
      });

      it('should show an error when the value is not a number', () => {
        let input = component.createRecipeForm.controls['cookTime'];

        input.setValue('a');
        cookTime.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        let cookTimeRequired = fixture.debugElement.query(By.css('[data-test=cookTimeRequired]'));
        let cookTimePattern = fixture.debugElement.query(By.css('[data-test=cookTimePattern]'));

        expect(input.errors['pattern']).toBeTruthy();
        expect(cookTime.nativeElement).toHaveClass('is-danger');
        expect(cookTimeRequired).toBeFalsy();
        expect(cookTimePattern).toBeTruthy();
      });
    });

    describe('difficulty', () => {
      it('should be invalid when empty', () => {
        let input = component.createRecipeForm.controls['difficulty'];

        expect(input.errors['required']).toEqual(true);
      });

      it('should show an error when the input is touched but empty', () => {
        let input = component.createRecipeForm.controls['difficulty'];

        input.setValue('');
        difficulty.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        let difficultyRequired = fixture.debugElement.query(By.css('[data-test=difficultyRequired]'));

        expect(input.errors['required']).toBeTruthy();
        expect(difficulty.nativeElement).toHaveClass('is-danger');
        expect(difficultyRequired).toBeTruthy();
      });

      it('should be valid when the user inputs a number', () => {
        let input = component.createRecipeForm.controls['difficulty'];

        input.setValue('2');
        difficulty.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        let difficultyRequired = fixture.debugElement.query(By.css('[data-test=difficultyRequired]'));
        let difficultyPattern = fixture.debugElement.query(By.css('[data-test=difficultyPattern]'));

        expect(input.errors).toBeFalsy();
        expect(difficulty.nativeElement).toHaveClass('is-success');
        expect(difficultyRequired).toBeFalsy();
        expect(difficultyPattern).toBeFalsy();
      });

      it('should show an error when the value is not a number', () => {
        let input = component.createRecipeForm.controls['difficulty'];

        input.setValue('a');
        difficulty.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        let difficultyRequired = fixture.debugElement.query(By.css('[data-test=difficultyRequired]'));
        let difficultyPattern = fixture.debugElement.query(By.css('[data-test=difficultyPattern]'));

        expect(input.errors['pattern']).toBeTruthy();
        expect(difficulty.nativeElement).toHaveClass('is-danger');
        expect(difficultyRequired).toBeFalsy();
        expect(difficultyPattern).toBeTruthy();
      });

      it('should show an error when the value is not 1 - 5', () => {
        let input = component.createRecipeForm.controls['difficulty'];

        input.setValue('6');
        difficulty.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        let difficultyRequired = fixture.debugElement.query(By.css('[data-test=difficultyRequired]'));
        let difficultyPattern = fixture.debugElement.query(By.css('[data-test=difficultyPattern]'));

        expect(input.errors['pattern']).toBeTruthy();
        expect(difficulty.nativeElement).toHaveClass('is-danger');
        expect(difficultyRequired).toBeFalsy();
        expect(difficultyPattern).toBeTruthy();
      });
    });

    describe('originalRecipeUrl', () => {
      it('should be valid when empty', () => {
        let input = component.createRecipeForm.controls['originalRecipeUrl'];

        expect(input.status).toEqual('VALID');
      });

      it('should show a success message when the user inputs a string', () => {
        let input = component.createRecipeForm.controls['originalRecipeUrl'];

        input.setValue('www.recipe.com');
        originalRecipeUrl.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(originalRecipeUrl.nativeElement).toHaveClass('is-success');
        expect(input.status).toEqual('VALID');
      });
    });

    describe('youtubeUrl', () => {
      it('should be valid when empty', () => {
        let input = component.createRecipeForm.controls['youtubeUrl'];

        expect(input.status).toEqual('VALID');
      });

      it('should show a success message when the user inputs a string', () => {
        let input = component.createRecipeForm.controls['youtubeUrl'];

        input.setValue('www.youtube.com/recipe');
        youtubeUrl.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(youtubeUrl.nativeElement).toHaveClass('is-success');
        expect(input.status).toEqual('VALID');
      });
    });

    describe('submit', () => {
      it('should show requirements when user tries to submit without entering information', () => {
        let form = component.createRecipeForm.controls;

        submitButton.nativeElement.click();
        fixture.detectChanges();

        spyOn(recipeService, 'createRecipe');
        expect(recipeService.createRecipe).not.toHaveBeenCalled();

        expect(form.name.errors['required']).toBeTruthy();
        expect(form.description.errors['required']).toBeTruthy();
        expect(form.ingredients['controls'][0].controls['ingredient'].errors['required']).toBeTruthy();
        expect(form.instructions['controls'][0].controls['instruction'].errors['required']).toBeTruthy();
        expect(form.cookTime.errors['required']).toBeTruthy();
        expect(form.difficulty.errors['required']).toBeTruthy();
        
        // select required messages
        let nameRequired = fixture.debugElement.query(By.css('[data-test=nameRequired]'));
        let descriptionRequired = fixture.debugElement.query(By.css('[data-test=descriptionRequired]'));
        let ingredientRequired = fixture.debugElement.query(By.css('[data-test=ingredientRequired]'));
        let instructionRequired = fixture.debugElement.query(By.css('[data-test=instructionRequired]'));
        let cookTimeRequired = fixture.debugElement.query(By.css('[data-test=cookTimeRequired]'));
        let difficultyRequired = fixture.debugElement.query(By.css('[data-test=difficultyRequired]'));
        
        // show error message expectations
        expect(nameRequired).toBeTruthy();
        expect(descriptionRequired).toBeTruthy();
        expect(ingredientRequired).toBeTruthy();
        expect(instructionRequired).toBeTruthy();
        expect(cookTimeRequired).toBeTruthy();
        expect(difficultyRequired).toBeTruthy();
        
        // show input class expectations
        expect(name.nativeElement).toHaveClass('is-danger');
        expect(description.nativeElement).toHaveClass('is-danger');
        expect(ingredients.nativeElement).toHaveClass('is-danger');
        expect(instructions.nativeElement).toHaveClass('is-danger');
        expect(cookTime.nativeElement).toHaveClass('is-danger');
        expect(difficulty.nativeElement).toHaveClass('is-danger');
      });

      it('should submit with valid credentials', () => {
        let form = component.createRecipeForm.controls;

        spyOn(recipeService, 'createRecipe').and.callFake(() => {
          return of({ 
            id: 1,
            name: 'eggs',
            message: 'Meal successfully created.' 
          });
        });
        spyOn(router, 'navigate');

        // set form values
        form.name.setValue('Sandwich');
        form.description.setValue('A simple meat and cheese sandwich.');
        form.ingredients['controls'][0].controls['ingredient'].setValue('1 slice of ham');
        form.instructions['controls'][0].controls['instruction'].setValue('Put ham between bread.');
        form.cookTime.setValue('20');
        form.difficulty.setValue('1');

        // this makes the name input valid
        // this was already tested in the name testing suite 
        // so we will just change the value this way
        component.availableName = true;
        
        // check that there should not be any errors
        expect(component.createRecipeForm.errors).toBeFalsy();
        
        submitButton.nativeElement.click();
        fixture.detectChanges();
        expect(recipeService.createRecipe).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith(['/recipes', 1]);
      });

      it('should return an error when there is a server error', () => {
        let form = component.createRecipeForm.controls;

        spyOn(recipeService, 'createRecipe').and.callFake(() => {
          return throwError({
            error: {
              message: 'There was an error creating your recipe.'
            }
          });
        });
        spyOn(router, 'navigate');

        // set form values
        form.name.setValue('Sandwich');
        form.description.setValue('A simple meat and cheese sandwich.');
        form.ingredients['controls'][0].controls['ingredient'].setValue('1 slice of ham');
        form.instructions['controls'][0].controls['instruction'].setValue('Put ham between bread.');
        form.cookTime.setValue('20');
        form.difficulty.setValue('1');

        // this makes the name input valid
        // this was already tested in the name testing suite 
        // so we will just change the value this way
        component.availableName = true;
        
        // check that there should not be any errors
        expect(component.createRecipeForm.errors).toBeFalsy();
        
        submitButton.nativeElement.click();
        fixture.detectChanges();
        expect(recipeService.createRecipe).toHaveBeenCalled();
        expect(router.navigate).not.toHaveBeenCalled();

        // show notification error
        let notification = fixture.debugElement.query(By.css('[data-test=formErrorMsg]'));
        expect(notification.nativeElement.innerText).toEqual('There was an error creating your recipe.');
      });
    });
  });
});
