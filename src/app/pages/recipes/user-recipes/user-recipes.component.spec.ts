import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRecipesComponent } from './user-recipes.component';
import { DebugElement } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RecipesModule } from '../recipes.module';
import { SearchesService } from '../../../utilities/services/searches/searches.service';
import { AuthService } from '../../../utilities/services/auth/auth.service';
import { UserRecipeCardInfo } from '../../../utilities/services/searches/user-recipe-card-info';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

let fixture: ComponentFixture<UserRecipesComponent>;
let loadingMsg: DebugElement;
let pageTitle: DebugElement;
let pageError: DebugElement;
let closePageError: DebugElement;
let noRecipesMsg: DebugElement;
let sortingSelect: DebugElement;
let amountSelect: DebugElement;
let recipeCount: DebugElement;

function selectElements() {
  loadingMsg = fixture.debugElement.query(By.css('[data-test=loading-msg]'));
  pageTitle = fixture.debugElement.query(By.css('.page-header__title'));
  pageError = fixture.debugElement.query(By.css('[data-test=errorMsg]'));
  closePageError = fixture.debugElement.query(By.css('[data-test=closeErrorMsg]'));
  noRecipesMsg = fixture.debugElement.query(By.css('[data-test=no-recipes-msg]'));
  sortingSelect = fixture.debugElement.query(By.css('[data-test=sorting-select]'));
  amountSelect = fixture.debugElement.query(By.css('[data-test=amount-select]'));
  recipeCount = fixture.debugElement.query(By.css('[data-test=recipe-count]'));
}

const recipesObj: UserRecipeCardInfo = {
  count: 1,
  username: 'johndoe',
  profilePic: {
    profilePicName: null
  },
  id: 1,
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
      likes: [],
      savedRecipes: [],
      description: 'An easy rice recipe',
      cookTime: 10,
      difficulty: 1,
      createdAt: 'Oct 08, 2019',
      updatedAt: 'Oct 08, 2019'
    }
  ]
};

const recipesObjWithoutRecipes: UserRecipeCardInfo = {
  count: 1,
  username: 'johndoe',
  profilePic: {
    profilePicName: null
  },
  id: 1,
  rows: []
};

const user = {
  id: 1,
  isAdmin: true,
  username: 'johndoe',
  savedRecipes: []
}

class MockSearchesService {
  byUsernameAtoZ(offest, limit, username) {
    return of();
  }
  byUsernameZtoA(offest, limit, username) {
    return of();
  }
}

class MockAuthService {
  currentUser() {
    return;
  }
}

class MockActivatedRoute {
  snapshot = { queryParams: { username: 'johndoe' } };
}

describe('UserRecipesComponent', () => {
  let component: UserRecipesComponent;
  let authService: AuthService;
  let searchesService: SearchesService;
  let activatedRoute: ActivatedRoute;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RecipesModule, RouterTestingModule, HttpClientTestingModule]
    })
    .overrideComponent(UserRecipesComponent, {
      set: {
        providers: [
          { provide: SearchesService, useClass: MockSearchesService },
          { provide: AuthService, useClass: MockAuthService },
          { provide: ActivatedRoute, useClass: MockActivatedRoute }
        ]
      }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRecipesComponent);
    component = fixture.componentInstance;
    authService = fixture.debugElement.injector.get(AuthService);
    searchesService = fixture.debugElement.injector.get(SearchesService);
    activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    it('should show a loading message when the data has not returned from the database', () => {
      fixture.detectChanges();
      selectElements();

      expect(loadingMsg).toBeTruthy();
    });

    it('should populate the page with the user\'s recipes', () => {
      spyOn(searchesService, 'byUsernameAtoZ').and.callFake(() => of(recipesObj));
      spyOn(authService, 'currentUser').and.returnValue(user);
      spyOn(component, 'getData').and.callThrough();

      fixture.detectChanges();
      selectElements();

      expect(searchesService.byUsernameAtoZ).toHaveBeenCalled();
      expect(authService.currentUser).toHaveBeenCalled();
      expect(component.getData).toHaveBeenCalled();

      expect(pageTitle.nativeElement.innerText).toContain('johndoe\'s Recipes');
      expect(recipeCount.nativeElement.innerText).toContain('1-1 of 1 recipes');
    });

    it('should show an error if the user does not exist', () => {
      spyOn(searchesService, 'byUsernameAtoZ').and.callFake(() => {
        return throwError({ error: {
          message: 'This user does not exist.'
        }});
      });
      spyOn(authService, 'currentUser').and.returnValue(user);
      spyOn(component, 'getData').and.callThrough();

      fixture.detectChanges();
      selectElements();

      expect(searchesService.byUsernameAtoZ).toHaveBeenCalled();
      expect(authService.currentUser).toHaveBeenCalled();
      expect(component.getData).toHaveBeenCalled();
      
      expect(pageError.nativeElement.innerText).toContain('This user does not exist.');
      expect(pageTitle).toBeFalsy();
    });

    it('should show an error if the user has not created any recipes', () => {
      spyOn(searchesService, 'byUsernameAtoZ').and.callFake(() => of(recipesObjWithoutRecipes));
      spyOn(authService, 'currentUser').and.returnValue(user);
      spyOn(component, 'getData').and.callThrough();

      fixture.detectChanges();
      selectElements();

      expect(searchesService.byUsernameAtoZ).toHaveBeenCalled();
      expect(authService.currentUser).toHaveBeenCalled();
      expect(component.getData).toHaveBeenCalled();
      
      expect(pageTitle.nativeElement.innerText).toContain('johndoe\'s Recipes');
      expect(noRecipesMsg.nativeElement.innerText).toContain('This user has not created any recipes.');
    });

    it('should show an error if there is no username parameter in the url', () => {
      activatedRoute.snapshot.queryParams['username'] = '';
      spyOn(searchesService, 'byUsernameAtoZ');
      spyOn(authService, 'currentUser');
      spyOn(component, 'getData');

      fixture.detectChanges();
      selectElements();

      expect(searchesService.byUsernameAtoZ).not.toHaveBeenCalled();
      expect(authService.currentUser).not.toHaveBeenCalled();
      expect(component.getData).not.toHaveBeenCalled();
      
      expect(pageTitle).toBeFalsy();
      expect(pageError.nativeElement.innerText).toContain('There was an error. You must search for a user.');

      closePageError.nativeElement.click();
      closePageError.nativeElement.dispatchEvent(new Event('click'));

      fixture.detectChanges();
      selectElements();

      expect(pageError).toBeFalsy();
      expect(loadingMsg).toBeFalsy();
    });

  });

  describe('sorting changes', () => {
    beforeEach(() => {
      spyOn(authService, 'currentUser').and.returnValue(user);
      spyOn(component, 'getData').and.callThrough();
      spyOn(searchesService, 'byUsernameAtoZ').and.callFake(() => of(recipesObj));
      spyOn(searchesService, 'byUsernameZtoA').and.callFake(() => of(recipesObj));
      spyOn(component, 'onSortingChange').and.callThrough();

      fixture.detectChanges();
      selectElements();
    });

    it('should call byUsernameZtoA when the user changes the options', () => {
      sortingSelect.nativeElement.value = 'Z - A';
      sortingSelect.nativeElement.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      expect(authService.currentUser).toHaveBeenCalled();
      expect(searchesService.byUsernameAtoZ).toHaveBeenCalledTimes(1);
      expect(searchesService.byUsernameZtoA).toHaveBeenCalledTimes(1);
      expect(component.getData).toHaveBeenCalled();
      expect(component.onSortingChange).toHaveBeenCalled();
    });

    it('should call byUsernameAtoZ when the user changes the options', () => {
      sortingSelect.nativeElement.value = 'A - Z';
      sortingSelect.nativeElement.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      expect(authService.currentUser).toHaveBeenCalled();
      expect(searchesService.byUsernameAtoZ).toHaveBeenCalledTimes(2);
      expect(searchesService.byUsernameZtoA).toHaveBeenCalledTimes(0);
      expect(component.getData).toHaveBeenCalled();
      expect(component.onSortingChange).toHaveBeenCalled();
    });
  });

  describe('amount changes', () => {
    beforeEach(() => {
      spyOn(authService, 'currentUser').and.returnValue(user);
      spyOn(component, 'getData').and.callThrough();
      spyOn(searchesService, 'byUsernameAtoZ').and.callFake(() => of(recipesObj));
      spyOn(searchesService, 'byUsernameZtoA');
      spyOn(component, 'onAmountChange').and.callThrough();

      fixture.detectChanges();
      selectElements();
    });

    it('should call byUsernameAtoZ with a limit of 18 when the user changes the amount options', () => {
      amountSelect.nativeElement.value = 'Show 18';
      amountSelect.nativeElement.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      expect(authService.currentUser).toHaveBeenCalled();
      expect(searchesService.byUsernameAtoZ).toHaveBeenCalledWith(0, 18, 'johndoe');
      expect(searchesService.byUsernameZtoA).not.toHaveBeenCalled();
      expect(component.getData).toHaveBeenCalled();
      expect(component.onAmountChange).toHaveBeenCalled();
    });
    
    it('should call byUsernameAtoZ with a limit of 9 when the user changes the amount options', () => {
      amountSelect.nativeElement.value = 'Show 9';
      amountSelect.nativeElement.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      expect(authService.currentUser).toHaveBeenCalled();
      expect(searchesService.byUsernameAtoZ).toHaveBeenCalledWith(0, 9, 'johndoe');
      expect(searchesService.byUsernameZtoA).not.toHaveBeenCalled();
      expect(component.getData).toHaveBeenCalled();
      expect(component.onAmountChange).toHaveBeenCalled();
    });
  });
});
