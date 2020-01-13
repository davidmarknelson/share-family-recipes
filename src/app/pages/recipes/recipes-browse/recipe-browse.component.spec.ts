import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeBrowseComponent } from './recipe-browse.component';
import { DebugElement } from '@angular/core';

import { RecipesModule } from '../recipes.module';
import { SearchesService } from '../../../utilities/services/searches/searches.service';
import { AuthService } from '../../../utilities/services/auth/auth.service';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';


let fixture: ComponentFixture<RecipeBrowseComponent>;
let ingredientsInput: HTMLInputElement;
let ingredientsSubmit: DebugElement;
let ingredientsError: DebugElement;
let ingredientsTag;
let ingredientsTagDelete;
let clearIngredientsBtn: DebugElement;
let loadingMsg: DebugElement;
let errorMsg: DebugElement;
let closeErrorMsg: DebugElement;
let amountSelect: DebugElement;
let sortingSelect: DebugElement;

function selectElements() {
  ingredientsInput = fixture.debugElement.query(By.css('[name=ingredient]')).nativeElement;
  ingredientsSubmit = fixture.debugElement.query(By.css('[type=submit]'));
  ingredientsError = fixture.debugElement.query(By.css('.filters__ingredient-error'));
  ingredientsTag = fixture.debugElement.queryAll(By.css('.tag'));
  ingredientsTagDelete = fixture.debugElement.queryAll(By.css('[data-test=ingredient-tag-delete]'));
  clearIngredientsBtn = fixture.debugElement.query(By.css('[data-test=clear-ingredients]'));
  loadingMsg = fixture.debugElement.query(By.css('[data-test=loadingMsg]'));
  errorMsg = fixture.debugElement.query(By.css('[data-test=errorMsg]'));
  closeErrorMsg = fixture.debugElement.query(By.css('[data-test=closeErrorMsg]'));
  sortingSelect = fixture.debugElement.query(By.css('[data-test=sorting-select]'));
  amountSelect = fixture.debugElement.query(By.css('[data-test=amount-select]'));
}

const recipesObj = {
  count: 1,
  rows: [
    {
      id: 1,
      name: 'Rice',
      creatorId: 1,
      mealPic: {
        mealPicName: 'picture.jpeg'
      },
      creator: {
        username: 'johndoe'
      },
      savedRecipes: [],
      likes: [],
      description: 'An easy rice recipe',
      cookTime: 10,
      difficulty: 1,
      createdAt: 'Oct 08, 2019',
      updatedAt: 'Oct 08, 2019'
    }
  ]
};

const user = {
  id: 1,
  isAdmin: true,
  username: 'johndoe',
  savedRecipes: []
}

class MockSearchesService {
  newest(offest, limit) {
    return of();
  }
  oldest(offest, limit) {
    return of();
  }
  byNamesAtoZ(offest, limit) {
    return of();
  }
  byNamesZtoA(offest, limit) {
    return of();
  }
  ingredientsByNewest(offest, limit, ingredientsArray) {
    return of();
  }
  ingredientsByOldest(offest, limit, ingredientsArray) {
    return of();
  }
  ingredientsByNameAtoZ(offest, limit, ingredientsArray) {
    return of();
  }
  ingredientsByNameZtoA(offest, limit, ingredientsArray) {
    return of();
  }
}

class MockAuthService {
  currentUser() {
    return;
  }
}

describe('RecipeBrowseComponent', () => {
  let component: RecipeBrowseComponent;
  let authService: AuthService;
  let searchesService: SearchesService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RecipesModule, RouterTestingModule, HttpClientTestingModule]
    })
    .overrideComponent(RecipeBrowseComponent, {
      set: {
        providers: [
          { provide: SearchesService, useClass: MockSearchesService },
          { provide: AuthService, useClass: MockAuthService }
        ]
      }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeBrowseComponent);
    component = fixture.componentInstance;
    authService = fixture.debugElement.injector.get(AuthService);
    searchesService = fixture.debugElement.injector.get(SearchesService);
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  describe('initiation', () => {
    it('should call currentUser and getData', () => {
      spyOn(authService, 'currentUser').and.returnValue(user);
      spyOn(component, 'getData');

      fixture.detectChanges();

      expect(authService.currentUser).toHaveBeenCalled();
      expect(component.getData).toHaveBeenCalled();
    });

    it('should show a loading message', () => {
      spyOn(authService, 'currentUser').and.returnValue(user);
      spyOn(component, 'getData');

      fixture.detectChanges();
      selectElements();

      expect(authService.currentUser).toHaveBeenCalled();
      expect(component.getData).toHaveBeenCalled();
      expect(loadingMsg).toBeTruthy();
    });

    it('should show an error message when there are no recipes and close the the error message', () => {
      spyOn(authService, 'currentUser').and.returnValue(user);
      spyOn(component, 'getData').and.callThrough();
      spyOn(searchesService, 'newest').and.callFake(() => {
        return throwError({ error: {
          message: 'There are no recipes with those ingredients.'
        }});
      });

      fixture.detectChanges();
      selectElements();

      expect(authService.currentUser).toHaveBeenCalled();
      expect(component.getData).toHaveBeenCalled();
      expect(searchesService.newest).toHaveBeenCalled();
      expect(loadingMsg).toBeFalsy();
      expect(errorMsg.nativeElement.innerText).toContain('There are no recipes with those ingredients.');

      closeErrorMsg.nativeElement.click();
      fixture.detectChanges();
      selectElements();

      expect(errorMsg).toBeFalsy();
    });

    it('should show an error message when there are no recipes', () => {
      spyOn(authService, 'currentUser').and.returnValue(user);
      spyOn(component, 'getData').and.callThrough();
      spyOn(searchesService, 'newest').and.callFake(() => {
        return of(recipesObj);
      });

      fixture.detectChanges();
      selectElements();

      expect(authService.currentUser).toHaveBeenCalled();
      expect(component.getData).toHaveBeenCalled();
      expect(loadingMsg).toBeFalsy();
    });
  });

  describe('select sorting', () => {
    beforeEach(() => {
      spyOn(authService, 'currentUser').and.returnValue(user);
      spyOn(component, 'getData').and.callThrough();
      spyOn(searchesService, 'newest').and.callFake(() => {
        return of(recipesObj);
      });

      fixture.detectChanges();
      selectElements();
    });

    it('should call Oldest when the user chooses Oldest', () => {
      spyOn(component, 'getDataOrIngredientData').and.callThrough();
      spyOn(searchesService, 'oldest').and.callFake(() => {
        return of(recipesObj);
      });
      spyOn(component, 'onSortingChange').and.callThrough();
  
      sortingSelect.nativeElement.value = 'Oldest';
      sortingSelect.nativeElement.dispatchEvent(new Event('change'));
      fixture.detectChanges();
  
      expect(component.getData).toHaveBeenCalled();
      expect(component.getDataOrIngredientData).toHaveBeenCalled();
      expect(component.onSortingChange).toHaveBeenCalled();
      expect(searchesService.oldest).toHaveBeenCalled();
    });

    it('should call newest when the user chooses newest', () => {
      spyOn(component, 'getDataOrIngredientData').and.callThrough();
      spyOn(component, 'onSortingChange').and.callThrough();
  
      sortingSelect.nativeElement.value = 'Newest';
      sortingSelect.nativeElement.dispatchEvent(new Event('change'));
      fixture.detectChanges();
  
      expect(component.getData).toHaveBeenCalled();
      expect(component.getDataOrIngredientData).toHaveBeenCalled();
      expect(component.onSortingChange).toHaveBeenCalled();
      expect(searchesService.newest).toHaveBeenCalled();
    });

    it('should call byNamesAtoZ when the user chooses A - Z', () => {
      spyOn(component, 'getDataOrIngredientData').and.callThrough();
      spyOn(searchesService, 'byNamesAtoZ').and.callFake(() => {
        return of(recipesObj);
      });
      spyOn(component, 'onSortingChange').and.callThrough();
  
      sortingSelect.nativeElement.value = 'A - Z';
      sortingSelect.nativeElement.dispatchEvent(new Event('change'));
      fixture.detectChanges();
  
      expect(component.getData).toHaveBeenCalled();
      expect(component.getDataOrIngredientData).toHaveBeenCalled();
      expect(component.onSortingChange).toHaveBeenCalled();
      expect(searchesService.byNamesAtoZ).toHaveBeenCalled();
    });

    it('should call byNamesZtoA when the user chooses Z - A', () => {
      spyOn(component, 'getDataOrIngredientData').and.callThrough();
      spyOn(searchesService, 'byNamesZtoA').and.callFake(() => {
        return of(recipesObj);
      });
      spyOn(component, 'onSortingChange').and.callThrough();
  
      sortingSelect.nativeElement.value = 'Z - A';
      sortingSelect.nativeElement.dispatchEvent(new Event('change'));
      fixture.detectChanges();
  
      expect(component.getData).toHaveBeenCalled();
      expect(component.getDataOrIngredientData).toHaveBeenCalled();
      expect(component.onSortingChange).toHaveBeenCalled();
      expect(searchesService.byNamesZtoA).toHaveBeenCalled();
    });

  });

  describe('select amount shown', () => {
    beforeEach(() => {
      spyOn(authService, 'currentUser').and.returnValue(user);
      spyOn(component, 'getData').and.callThrough();
      spyOn(searchesService, 'newest').and.callFake(() => {
        return of(recipesObj);
      });

      fixture.detectChanges();
      selectElements();
    });

    it('should initialize with the value to show 9', () => {
      expect(amountSelect.nativeElement.value).toEqual('Show 9');
    });

    it('should call the last used function with a different limit when changed to 18', () => {
      spyOn(component, 'getDataOrIngredientData').and.callThrough();
      spyOn(component, 'onAmountChange').and.callThrough();

      amountSelect.nativeElement.value = 'Show 18';
      amountSelect.nativeElement.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      expect(component.getDataOrIngredientData).toHaveBeenCalled();
      expect(component.onAmountChange).toHaveBeenCalled();
      expect(searchesService.newest).toHaveBeenCalledWith(0, 18);
    });

    it('should call the last used function with a different limit when changed back to 9', () => {
      spyOn(component, 'getDataOrIngredientData').and.callThrough();
      spyOn(component, 'onAmountChange').and.callThrough();

      amountSelect.nativeElement.value = 'Show 9';
      amountSelect.nativeElement.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      expect(component.getDataOrIngredientData).toHaveBeenCalled();
      expect(component.onAmountChange).toHaveBeenCalled();
      expect(searchesService.newest).toHaveBeenCalledWith(0, 9);
    });
  });

  describe('ingredients', () => {
    beforeEach(() => {
      spyOn(authService, 'currentUser').and.returnValue(user);
      spyOn(component, 'getData').and.callThrough();
      spyOn(searchesService, 'newest').and.callFake(() => {
        return of(recipesObj);
      });

      fixture.detectChanges();
      return fixture.whenStable().then(() => {
        fixture.detectChanges();
        selectElements();
      });
    });

    it('should show an error if the user tries to submit an empty ingredient', () => {
      ingredientsSubmit.nativeElement.click();
      ingredientsSubmit.nativeElement.dispatchEvent(new Event('click'));
      fixture.detectChanges();
      selectElements();

      expect(ingredientsError.nativeElement.innerText).toContain('You must add an ingredient.');
    });

    it('should add an ingredient to the ingredients list', () => {
      ingredientsInput.value = 'egg';
      ingredientsInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      selectElements();

      spyOn(component, 'getIngredientData').and.callThrough();
      spyOn(component, 'getSortingOptionForIngredients').and.callThrough();
      spyOn(component, 'addIngredient').and.callThrough();
      spyOn(searchesService, 'ingredientsByNewest').and.callFake(() => of(recipesObj));

      ingredientsSubmit.nativeElement.click();
      ingredientsSubmit.nativeElement.dispatchEvent(new Event('click'));
      fixture.detectChanges();
      selectElements();

      expect(ingredientsTag.length).toEqual(1);
      expect(ingredientsTag[0].nativeElement.innerText).toContain('egg');
      expect(component.getIngredientData).toHaveBeenCalled();
      expect(component.getSortingOptionForIngredients).toHaveBeenCalled();
      expect(component.addIngredient).toHaveBeenCalled();
      expect(searchesService.ingredientsByNewest).toHaveBeenCalled();
    });
    
    it('should delete an ingredient and call the ingredients function', () => {
      // add ingredient
      ingredientsInput.value = 'egg';
      ingredientsInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      selectElements();

      ingredientsSubmit.nativeElement.click();
      ingredientsSubmit.nativeElement.dispatchEvent(new Event('click'));
      fixture.detectChanges();
      selectElements();

      // add ingredient
      ingredientsInput.value = 'bacon';
      ingredientsInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      selectElements();

      ingredientsSubmit.nativeElement.click();
      ingredientsSubmit.nativeElement.dispatchEvent(new Event('click'));
      fixture.detectChanges();
      selectElements();

      // expectations for length
      expect(ingredientsTag.length).toEqual(2);
      expect(ingredientsTag[0].nativeElement.innerText).toContain('egg');
      expect(ingredientsTag[1].nativeElement.innerText).toContain('bacon');

      // spys
      spyOn(component, 'clearIngredient').and.callThrough();
      spyOn(component, 'getDataOrIngredientData').and.callThrough();
      spyOn(component, 'getIngredientData').and.callThrough();
      spyOn(component, 'getSortingOptionForIngredients').and.callThrough();
      spyOn(searchesService, 'ingredientsByNewest').and.callFake(() => of(recipesObj));

      // delete bacon
      ingredientsTagDelete[1].nativeElement.click();
      ingredientsTagDelete[1].nativeElement.dispatchEvent(new Event('click'));
      fixture.detectChanges();
      selectElements();

      // expectations for length
      expect(ingredientsTag.length).toEqual(1);
      expect(ingredientsTag[0].nativeElement.innerText).toContain('egg');
      
      // expectations for spys
      expect(component.clearIngredient).toHaveBeenCalled();
      expect(component.getDataOrIngredientData).toHaveBeenCalled();
      expect(component.getIngredientData).toHaveBeenCalled();
      expect(component.getSortingOptionForIngredients).toHaveBeenCalled();
      expect(searchesService.ingredientsByNewest).toHaveBeenCalled();
    });

    it('should add an ingredient to the ingredients list and not get recipes by ingredients because there are no ingredients', () => {
      // add ingredient
      ingredientsInput.value = 'egg';
      ingredientsInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      selectElements();

      ingredientsSubmit.nativeElement.click();
      ingredientsSubmit.nativeElement.dispatchEvent(new Event('click'));
      fixture.detectChanges();
      selectElements();

      // spys
      spyOn(component, 'clearIngredients').and.callThrough();
      spyOn(component, 'getIngredientData');
      spyOn(component, 'getDataOrIngredientData').and.callThrough();

      // Clear Ingredients
      clearIngredientsBtn.nativeElement.click();
      clearIngredientsBtn.nativeElement.dispatchEvent(new Event('click'));
      fixture.detectChanges();
      selectElements();

      expect(ingredientsTag.length).toEqual(0)

      expect(component.getDataOrIngredientData).toHaveBeenCalled();
      expect(component.clearIngredients).toHaveBeenCalled();
      expect(component.getData).toHaveBeenCalled();
      expect(component.getIngredientData).not.toHaveBeenCalled();
      expect(searchesService.newest).toHaveBeenCalled();
    });

    it('should get recipes by ingredients when changing sorting options', () => {
      // add ingredient
      ingredientsInput.value = 'egg';
      ingredientsInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      selectElements();

      ingredientsSubmit.nativeElement.click();
      ingredientsSubmit.nativeElement.dispatchEvent(new Event('click'));
      fixture.detectChanges();
      selectElements();

      // spys
      spyOn(component, 'onSortingChange').and.callThrough();
      spyOn(component, 'getDataOrIngredientData').and.callThrough();
      spyOn(component, 'getIngredientData').and.callThrough();
      spyOn(component, 'getSortingOptionForIngredients').and.callThrough();
      spyOn(searchesService, 'ingredientsByOldest').and.callFake(() => of(recipesObj));

      // Change sorting option
      sortingSelect.nativeElement.value = 'Oldest';
      sortingSelect.nativeElement.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      expect(component.onSortingChange).toHaveBeenCalled();
      expect(component.getDataOrIngredientData).toHaveBeenCalled();
      expect(component.getIngredientData).toHaveBeenCalled();
      expect(component.getSortingOptionForIngredients).toHaveBeenCalled();
      expect(searchesService.ingredientsByOldest).toHaveBeenCalled();
    });

    it('should get recipes by ingredients when changing amount options', () => {
      // add ingredient
      ingredientsInput.value = 'egg';
      ingredientsInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      selectElements();

      ingredientsSubmit.nativeElement.click();
      ingredientsSubmit.nativeElement.dispatchEvent(new Event('click'));
      fixture.detectChanges();
      selectElements();

      // spys
      spyOn(component, 'onAmountChange').and.callThrough();
      spyOn(component, 'getDataOrIngredientData').and.callThrough();
      spyOn(component, 'getIngredientData').and.callThrough();
      spyOn(component, 'getSortingOptionForIngredients').and.callThrough();
      spyOn(searchesService, 'ingredientsByNewest').and.callFake(() => of(recipesObj));

      // Change sorting option
      amountSelect.nativeElement.value = 'Show 18';
      amountSelect.nativeElement.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      expect(component.onAmountChange).toHaveBeenCalled();
      expect(component.getDataOrIngredientData).toHaveBeenCalled();
      expect(component.getIngredientData).toHaveBeenCalled();
      expect(component.getSortingOptionForIngredients).toHaveBeenCalled();
      expect(searchesService.ingredientsByNewest).toHaveBeenCalledWith(0, 18, ['egg']);
    });
  });
});
