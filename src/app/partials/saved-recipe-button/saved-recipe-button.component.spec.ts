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
  iat: 1575496172,
  exp: 2180296172
};

const recipeObj = {
  id: 1,
  name: "Eggs and Rice",
  description: "A delicious and easy dish.",
  creatorId: 1,
  creator: { 
    username: "johndoe", 
    profilePic: {
      profilePicName: "../../../assets/images/default-img/default-profile-pic.jpg"
    } 
  },
  ingredients: [ "3 eggs", "rice", "vegetables" ],
  instructions: [ "cooks eggs", "cook rice", "mix and serve" ],
  cookTime: 20,
  difficulty: 1,
  likes: [],
  savedRecipes: [],
  mealPic: { 
    mealPicName: "../../../assets/images/default-img/default-meal-pic.jpg" 
  },
  createdAt: "Dec 04, 2019",
  updatedAt: "Dec 04, 2019",
};

let fixture: ComponentFixture<SavedRecipeButtonComponent>;
let saveBtn: DebugElement;

function selectElements() {
  saveBtn = fixture.debugElement.query(By.css('.button'));

}
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
    component.recipe = recipeObj;
    component.user = userObj;
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  describe('signed in user', () => {
    beforeEach(() => {
      component.recipe = recipeObj;
      component.user = userObj;
      spyOn(component, 'checkSaved');

      fixture.detectChanges();
      selectElements();
    });

    it('should call checkSaved when the page loads', () => {
      expect(component.checkSaved).toHaveBeenCalled();
    });

    it('should unsave a recipe', () => {
      spyOn(component, 'toggleSaveRecipes').and.callThrough();
      component.recipe.savedRecipes = [{userId: 1}];

      spyOn(savedRecipesService, 'unsaveRecipe').and.callFake(() => {
        return of({
          message: 'Recipe successfully unsaved.'
        })
      });

      saveBtn.nativeElement.click();
      fixture.detectChanges();
      selectElements();
      
      expect(saveBtn.nativeElement.innerText).toContain('Save');
      expect(component.toggleSaveRecipes).toHaveBeenCalledTimes(1);
      expect(savedRecipesService.unsaveRecipe).toHaveBeenCalled();
    });

    it('should save a recipe', () => {
      component.recipe.savedRecipes = [];
      spyOn(component, 'toggleSaveRecipes').and.callThrough();
      spyOn(savedRecipesService, 'saveRecipe').and.callFake(() => {
        return of({
          message: 'Recipe successfully saved.'
        })
      });

      saveBtn.nativeElement.click();

      fixture.detectChanges();

      expect(component.toggleSaveRecipes).toHaveBeenCalled();
      expect(savedRecipesService.saveRecipe).toHaveBeenCalled();
    });
  });

  describe('user not signed in', () => {
    beforeEach(() => {
      component.recipe = recipeObj;
      component.user = null;
      spyOn(component, 'checkSaved');
      spyOn(component, 'errorToast');

      fixture.detectChanges();
      selectElements();
    });

    it('should not call saved recipe service', () => {
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
