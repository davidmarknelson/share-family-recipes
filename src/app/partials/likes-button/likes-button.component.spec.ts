import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { LikesButtonComponent } from './likes-button.component';
import { DebugElement } from '@angular/core';
import { LikesService } from '../../utilities/services/likes/likes.service';
import { LikesButtonModule } from './likes-button.module';

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
};

const userObj = {
  id: 1,
  isAdmin: false,
  username: "johndoe",
  iat: 1575496172,
  exp: 2180296172
};

class MockLikesService {
  addLike(recipeId) {
    return of()
  }
  removeLike(recipeId) {
    return of()
  }
}

describe('LikesButtonComponent', () => {
  let component: LikesButtonComponent;
  let likesService: LikesService;
  let fixture: ComponentFixture<LikesButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [LikesButtonModule]
    })
    .overrideComponent(LikesButtonComponent, {
      set: {
        providers: [
          { provide: LikesService, useClass: MockLikesService }
        ]
      }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LikesButtonComponent);
    likesService = fixture.debugElement.injector.get(LikesService);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.recipe = recipeObj;
    component.user = userObj;
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  describe('likes for a signed in user', () => {
    beforeEach(() => {
      component.recipe = recipeObj;
      component.user = userObj;
      spyOn(component, 'checkLikes');

      fixture.detectChanges();
    });

    it('should call checkLikes when the page loads', () => {
      expect(component.checkLikes).toHaveBeenCalled();
    });

    it('should add a like', () => {
      let likeBtn: DebugElement = fixture.debugElement.query(By.css('.btn'));

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
      let likeBtn: DebugElement = fixture.debugElement.query(By.css('.btn'));

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
      component.recipe = recipeObj;
      component.user = null;
      spyOn(component, 'checkLikes');

      fixture.detectChanges();
    });

    it('should not call likes service', () => {
      let likeBtn: DebugElement = fixture.debugElement.query(By.css('.btn'));

      spyOn(component, 'toggleLikes').and.callThrough();
      spyOn(likesService, 'addLike');

      likeBtn.nativeElement.click();

      fixture.detectChanges();

      expect(component.toggleLikes).toHaveBeenCalled();
      expect(likesService.addLike).not.toHaveBeenCalled();
    });
  });
});
