import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { RecipeViewComponent } from './recipe-view.component';
import { RecipesModule } from '../recipes.module';
import { ActivatedRoute} from '@angular/router';
import { RecipeService } from '../../../utilities/services/recipe/recipe.service';
import { AuthService } from '../../../utilities/services/auth/auth.service';
import { LikesService } from '../../../utilities/services/likes/likes.service';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

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
  mealPic: { 
    mealPicName: "../../../assets/images/default-img/default-meal-pic.jpg" 
  },
  createdAt: "Dec 04, 2019",
  updatedAt: "Dec 04, 2019",
  originalRecipeUrl: 'http://www.originalrecipe.com',
  youtubeUrl: "https://www.youtube-nocookie.com/embed/MV0F_XiR48Q"
};

const recipe2Obj = {
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
  mealPic: { 
    mealPicName: "../../../assets/images/default-img/default-meal-pic.jpg" 
  },
  createdAt: "Dec 04, 2019",
  updatedAt: "Dec 04, 2019",
};

const userObj = {
  id: 1,
  isAdmin: false,
  username: "johndoe",
  iat: 1575496172,
  exp: 2180296172
};

class MockActivatedRoute {
  snapshot = { params: { recipe: '1' } };
}

class MockRecipeService {
  getRecipeByName(name) {
    return of()
  }
  getRecipeById(id) {
    return of()
  }
}

class MockAuthService {
  isLoggedIn() {}
  currentUser() {}
}

class MockLikesService {
  addLike(recipeId) {
    return of()
  }
  removeLike(recipeId) {
    return of()
  }
}

describe('RecipeViewComponent', () => {
  let component: RecipeViewComponent;
  let authService: AuthService;
  let activatedRoute: ActivatedRoute;
  let recipeService: RecipeService;
  let likesService: LikesService;
  let fixture: ComponentFixture<RecipeViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RecipesModule, RouterTestingModule]
    })
    .overrideComponent(RecipeViewComponent, {
      set: {
        providers: [
          { provide: RecipeService, useClass: MockRecipeService },
          { provide: ActivatedRoute, useClass: MockActivatedRoute },
          { provide: AuthService, useClass: MockAuthService },
          { provide: LikesService, useClass: MockLikesService }
        ]
      }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeViewComponent);
    component = fixture.componentInstance;
    authService = fixture.debugElement.injector.get(AuthService);
    recipeService = fixture.debugElement.injector.get(RecipeService);
    likesService = fixture.debugElement.injector.get(LikesService);
    activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  describe('error', () => {
    it('should show an error message with the recipe id when the recipe does not exist', () => {
      spyOn(component, 'getRecipeById').and.callThrough();
      spyOn(recipeService, 'getRecipeById').and.callFake(() => {
        return throwError({
          error: {
            message: 'That meal does not exist.'
          }
        });
      });

      fixture.detectChanges();

      expect(component.getRecipeById).toHaveBeenCalled();
      expect(recipeService.getRecipeById).toHaveBeenCalled();

      let errorMsg: DebugElement = fixture.debugElement.query(By.css('.message-body'));
      
      expect(errorMsg.nativeElement.innerText).toContain('That meal does not exist.')
    });

    it('should show an error message with the recipe name when the recipe does not exist', () => {
      activatedRoute.snapshot.params.recipe = 'egg';

      spyOn(component, 'getRecipeByName').and.callThrough();
      spyOn(recipeService, 'getRecipeByName').and.callFake(() => {
        return throwError({
          error: {
            message: 'That meal does not exist.'
          }
        });
      });

      fixture.detectChanges();

      expect(component.getRecipeByName).toHaveBeenCalled();
      expect(recipeService.getRecipeByName).toHaveBeenCalled();

      let errorMsg: DebugElement = fixture.debugElement.query(By.css('.message-body'));
      
      expect(errorMsg.nativeElement.innerText).toContain('That meal does not exist.')
    });
  });

  describe('recipe', () => {
    it('should populate the page with the information and show the edit button for the creator', () => {
      spyOn(authService, 'isLoggedIn').and.callFake(() => true);
      spyOn(authService, 'currentUser').and.callFake(() => userObj);

      spyOn(component, 'getRecipeById').and.callThrough();
      spyOn(recipeService, 'getRecipeById').and.callFake(() => {
        return of(recipeObj);        
      });

      fixture.detectChanges();

      expect(component.getRecipeById).toHaveBeenCalled();
      expect(recipeService.getRecipeById).toHaveBeenCalled();

      let title: DebugElement = fixture.debugElement.query(By.css('.page-header__title'));
      let editBtn: DebugElement = fixture.debugElement.query(By.css('[data-test=edit-btn]'));
      let iframeVideo: DebugElement = fixture.debugElement.query(By.css('iframe'));

      expect(title.nativeElement.innerText).toEqual('Eggs and Rice');
      expect(editBtn).toBeTruthy();
      expect(iframeVideo).toBeTruthy();
    });

    it('should populate the page with the information and not show the edit button', () => {
      spyOn(component, 'getRecipeById').and.callThrough();
      spyOn(recipeService, 'getRecipeById').and.callFake(() => {
        return of(recipe2Obj);        
      });

      fixture.detectChanges();

      expect(component.getRecipeById).toHaveBeenCalled();
      expect(recipeService.getRecipeById).toHaveBeenCalled();

      let title: DebugElement = fixture.debugElement.query(By.css('.page-header__title'));
      let editBtn: DebugElement = fixture.debugElement.query(By.css('[data-test=edit-btn]'));

      expect(title.nativeElement.innerText).toEqual('Eggs and Rice');
      expect(editBtn).toBeFalsy();
    });
  });

  describe('likes', () => {
    beforeEach(() => {
      spyOn(authService, 'isLoggedIn').and.callFake(() => true);
      spyOn(authService, 'currentUser').and.callFake(() => userObj);

      spyOn(component, 'getRecipeById').and.callThrough();
      spyOn(recipeService, 'getRecipeById').and.callFake(() => {
        return of(recipe2Obj);        
      });
      spyOn(component, 'checkLikes');

      fixture.detectChanges();
    });

    it('should call checkLikes when the page loads', () => {
      expect(component.checkLikes).toHaveBeenCalled();
    });

    it('should add a like', () => {
      let likeBtn: DebugElement = fixture.debugElement.query(By.css('.info__icon-btn'));

      spyOn(component, 'toggleLikes').and.callThrough();
      spyOn(likesService, 'addLike').and.callFake(() => {
        return of({
          message: 'Meal successfully liked.'
        })
      });

      likeBtn.nativeElement.click();

      fixture.detectChanges();

      expect(component.toggleLikes).toHaveBeenCalled();
      expect(likesService.addLike).toHaveBeenCalled();
    });

    it('should remove a like', () => {
      let likeBtn: DebugElement = fixture.debugElement.query(By.css('.info__icon-btn'));

      spyOn(component, 'toggleLikes').and.callThrough();
      spyOn(likesService, 'addLike').and.callFake(() => {
        return of({
          message: 'Meal successfully liked.'
        })
      });

      likeBtn.nativeElement.click();

      fixture.detectChanges();

      spyOn(likesService, 'removeLike').and.callFake(() => {
        return of({
          message: 'Meal successfully unliked.'
        })
      });

      likeBtn.nativeElement.click();

      fixture.detectChanges();

      expect(component.toggleLikes).toHaveBeenCalledTimes(2);
      expect(likesService.removeLike).toHaveBeenCalled();
    });
  });

  describe('likes for a user not signed in', () => {
    beforeEach(() => {
      spyOn(authService, 'isLoggedIn').and.callFake(() => false);

      spyOn(component, 'getRecipeById').and.callThrough();
      spyOn(recipeService, 'getRecipeById').and.callFake(() => {
        return of(recipe2Obj);        
      });
      spyOn(component, 'checkLikes');

      fixture.detectChanges();
    });

    it('should not call likes service', () => {
      let likeBtn: DebugElement = fixture.debugElement.query(By.css('.info__icon-btn'));

      spyOn(component, 'toggleLikes').and.callThrough();
      spyOn(likesService, 'addLike');

      likeBtn.nativeElement.click();

      fixture.detectChanges();

      expect(component.toggleLikes).toHaveBeenCalled();
      expect(likesService.addLike).not.toHaveBeenCalled();
    });
  });
});
