import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { SavedRecipeButtonComponent } from './saved-recipe-button.component';
import { DebugElement } from '@angular/core';
import { SavedRecipesService } from '../../utilities/services/saved-recipes/saved-recipes.service';
import { SavedRecipeButtonModule } from './saved-recipe-button.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';

const userObj = {
  id: 1,
  isAdmin: false,
  username: "johndoe",
  savedRecipes: [
    { mealId: 1 }
  ],
  iat: 1575496172,
  exp: 2180296172
};

class MockSavedRecipesService {
  saveRecipe() {
    return of();
  }
  unsaveRecipe() {
    return of();
  }
}

describe('SavedRecipeButtonComponent', () => {
  let component: SavedRecipeButtonComponent;
  let savedRecipesService: SavedRecipesService
  let fixture: ComponentFixture<SavedRecipeButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SavedRecipeButtonModule, HttpClientTestingModule]
    })
    .overrideComponent(SavedRecipeButtonComponent, {
      set: {
        providers: [
          { provide: savedRecipesService, useClass: MockSavedRecipesService }
        ]
      }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedRecipeButtonComponent);
    savedRecipesService = fixture.debugElement.injector.get(SavedRecipesService);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.recipeId = 1;
    component.user = userObj;
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  describe('signed in user', () => {
    beforeEach(() => {
      component.recipeId = 1;
      component.user = userObj;
      spyOn(component, 'checkSaved');

      fixture.detectChanges();
    });

    it('should call checkSaved when the page loads', () => {
      expect(component.checkSaved).toHaveBeenCalled();
    });

    it('should unsave a recipe', () => {
      let saveBtn: DebugElement = fixture.debugElement.query(By.css('.button'));

      spyOn(component, 'toggleSaveRecipes').and.callThrough();
      spyOn(savedRecipesService, 'unsaveRecipe').and.callFake(() => {
        return of({
          message: 'Recipe successfully unsaved.'
        })
      });

      saveBtn.nativeElement.click();

      fixture.detectChanges();

      expect(component.toggleSaveRecipes).toHaveBeenCalled();
      expect(savedRecipesService.unsaveRecipe).toHaveBeenCalled();
    });

    it('should save a recipe', () => {
      let saveBtn: DebugElement = fixture.debugElement.query(By.css('.button'));

      spyOn(component, 'toggleSaveRecipes').and.callThrough();
      spyOn(savedRecipesService, 'unsaveRecipe').and.callFake(() => {
        return of({
          message: 'Recipe successfully unsaved.'
        })
      });

      saveBtn.nativeElement.click();

      fixture.detectChanges();

      spyOn(savedRecipesService, 'saveRecipe').and.callFake(() => {
        return of({
          message: 'Recipe successfully saved.'
        })
      });

      saveBtn.nativeElement.click();

      fixture.detectChanges();

      expect(component.toggleSaveRecipes).toHaveBeenCalledTimes(2);
      expect(savedRecipesService.saveRecipe).toHaveBeenCalled();
    });
  });

  describe('user not signed in', () => {
    beforeEach(() => {
      component.recipeId = 1;
      component.user = null;
      spyOn(component, 'checkSaved');
      spyOn(component, 'errorToast');

      fixture.detectChanges();
    });

    it('should not call saved recipe service', () => {
      let saveBtn: DebugElement = fixture.debugElement.query(By.css('.button'));

      spyOn(component, 'toggleSaveRecipes').and.callThrough();
      spyOn(savedRecipesService, 'saveRecipe');

      saveBtn.nativeElement.click();

      fixture.detectChanges();

      expect(component.toggleSaveRecipes).toHaveBeenCalled();
      expect(savedRecipesService.saveRecipe).not.toHaveBeenCalled();
      expect(component.errorToast).toHaveBeenCalled();
    });
  });
});
