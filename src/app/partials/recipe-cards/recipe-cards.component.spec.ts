import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RecipeCardsModule } from './recipe-cards.module';
import { RecipeCardsComponent } from './recipe-cards.component';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

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
        username: 'johndoe#1'
      },
      likes: [],
      description: 'An easy rice recipe',
      cookTime: 10,
      difficulty: 1,
      createdAt: 'Oct 08, 2019',
      updatedAt: 'Oct 08, 2019'
    }
  ]
};

class MockRouter {
  navigate(path) {}
  navigateByUrl(path) {}
}

describe('RecipeCardsComponent', () => {
  let component: RecipeCardsComponent;
  let router: Router;
  let fixture: ComponentFixture<RecipeCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RecipeCardsModule, HttpClientTestingModule]
    })
    .overrideComponent(RecipeCardsComponent, {
      set: {
        providers: [
          { provide: Router, useClass: MockRouter }
        ]
      }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeCardsComponent);
    component = fixture.componentInstance;
    router = fixture.debugElement.injector.get(Router);
    component.recipes = recipesObj;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to the recipe when the View Recipe button is clicked', () => {
    let viewBtn: DebugElement = fixture.debugElement.query(By.css('.view-btn__container > button'));

    spyOn(component, 'goToRecipe').and.callThrough();
    spyOn(router, 'navigate');

    viewBtn.nativeElement.click();
    fixture.detectChanges();

    expect(component.goToRecipe).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/recipes/1']);
  });

  it('should call navigateByUrl with an encoded username when the creator username is clicked', () => {
    spyOn(router, "navigateByUrl");
    spyOn(component, 'goToUsersRecipes').and.callThrough()

    let usernameLink: DebugElement = fixture.debugElement.query(By.css('[data-test=user-recipe-link]'));
    usernameLink.nativeElement.click()
    fixture.detectChanges();

    expect(component.goToUsersRecipes).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/recipes/user-recipes?username=johndoe%231');
  });
});
