import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeBrowseComponent } from './recipe-browse.component';
import { DebugElement } from '@angular/core';

import { RecipesModule } from '../recipes.module';
import { Router } from '@angular/router';
import { RecipeService } from '../../../utilities/services/recipe/recipe.service';
import { AuthService } from '../../../utilities/services/auth/auth.service';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

class MockRouter {
  navigate(path) {

  }
}

class MockRecipeService {

}

describe('RecipeBrowseComponent', () => {
  let component: RecipeBrowseComponent;
  let fixture: ComponentFixture<RecipeBrowseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RecipesModule, RouterTestingModule, HttpClientTestingModule]
    })
    .overrideComponent(RecipeBrowseComponent, {
      set: {
        providers: [
          { provide: RecipeService, useClass: MockRecipeService },
          { provide: Router, useClass: MockRouter },
        ]
      }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeBrowseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
