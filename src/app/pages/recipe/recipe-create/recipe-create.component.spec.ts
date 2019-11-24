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
let submitButton: DebugElement;

function selectElements() {
  name = fixture.debugElement.query(By.css('[data-test=name]'));
  description = fixture.debugElement.query(By.css('[data-test=description]'));
  descriptionCount = fixture.debugElement.query(By.css('[data-test=descriptionCount]'));
  submitButton = fixture.debugElement.query(By.css('[data-test=submit-button]'));
}

class MockRecipeService {
  checkRecipeNameAvailability(name) {}
}

class MockRouter {
  navigate(path) {}
}

class MockLocation {
  back() {}
}

fdescribe('RecipeCreateComponent', () => {
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
  });
});
