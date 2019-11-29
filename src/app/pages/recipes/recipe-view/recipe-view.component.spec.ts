import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeViewComponent } from './recipe-view.component';
import { RecipesModule } from '../recipes.module';
import { Router, ActivatedRoute} from '@angular/router';
import { RecipeService } from '../../../utilities/services/recipe/recipe.service';

class MockActivatedRoute {
  snapshot = { params: { id: 'eggs' } };
}

class MockRouter {
  navigate(path) {}
}

class MockRecipeService {
  getRecipe(name) {}
}

describe('RecipeViewComponent', () => {
  let component: RecipeViewComponent;
  let router: Router;
  let fixture: ComponentFixture<RecipeViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RecipesModule]
    })
    .overrideComponent(RecipeViewComponent, {
      set: {
        providers: [
          { provide: RecipeService, useClass: MockRecipeService },
          { provide: Router, useClass: MockRouter },
          { provide: ActivatedRoute, useClass: MockActivatedRoute }
        ]
      }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeViewComponent);
    component = fixture.componentInstance;
    router = fixture.debugElement.injector.get(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
