import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RecipeService } from './recipe.service';

describe('MealService', () => {
  let recipeService: RecipeService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [RecipeService]
    });
    
    http = TestBed.get(HttpTestingController);
    recipeService = TestBed.get(RecipeService);
  });

  it('should be created', () => {
    const service: RecipeService = TestBed.get(RecipeService);
    expect(service).toBeTruthy();
  });

  describe('createRecipe', () => {
    it('should return a message when the recipe is successfully created', () => {
      const recipe = { 
        name: 'Fried Rice',
        description: 'A simple rice dish.',
        ingredients: [
          'rice', 'egg', 'oil'
        ],
        instructions: [
          'Cook rice.', 'Fry rice in the pan with an egg.'
        ],
        cookTime: 15,
        difficulty: 2
      };
      const mealPic = null;
      const signupResponse = {
        'id': 1,
        'message': "Meal successfully created."
      };
      let response;

      recipeService.createRecipe(recipe, mealPic).subscribe(res => {
        response = res;
      });

      http.expectOne('http://localhost:3000/meals/create').flush(signupResponse);
      expect(response).toEqual(signupResponse);
      http.verify();
    });

    it('should return an error when there is a server error', () => {
      const recipe = { 
        name: 'Fried Rice',
        description: 'A simple rice dish.',
        ingredients: [
          'rice', 'egg', 'oil'
        ],
        instructions: [
          'Cook rice.', 'Fry rice in the pan with an egg.'
        ],
        cookTime: 15,
        difficulty: 2
      };
    
      const mealPic = null;
      const signupResponse = 'There was an error creating your meal.';
      let errorResponse;
    
      recipeService.createRecipe(recipe, mealPic).subscribe(res => {}, err => {
        errorResponse = err;
      });
    
      http.expectOne('http://localhost:3000/meals/create')
        .flush({message: signupResponse}, {status: 500, statusText: 'Server Error'});
      expect(errorResponse.error.message).toEqual(signupResponse);
      http.verify();
    });

    it('should return an error when the meal picture image is not a jpeg', () => {
      const recipe = { 
        name: 'Fried Rice',
        description: 'A simple rice dish.',
        ingredients: [
          'rice', 'egg', 'oil'
        ],
        instructions: [
          'Cook rice.', 'Fry rice in the pan with an egg.'
        ],
        cookTime: 15,
        difficulty: 2
      };
      let blob = new Blob([""], { type: 'image/png' });
      blob["lastModifiedDate"] = "";
      blob["name"] = "test.png";
      const mealPic = <File>blob;
      
      const signupResponse = 'Please upload a JPEG image.';
      let errorResponse;

      recipeService.createRecipe(recipe, mealPic).subscribe(res => {}, err => {
        errorResponse = err;
      });

      http.expectOne('http://localhost:3000/meals/create')
        .flush({message: signupResponse}, {status: 400, statusText: 'Bad Request'});
      expect(errorResponse.error.message).toEqual(signupResponse);
      http.verify();
    });
  });

  describe('checkRecipeNameAvailability', () => {
    it('should return a 204 status if a name is not already used', () => {
      let signupResponse = null;

      let response;
      recipeService.checkRecipeNameAvailability('rice').subscribe(res => {
        response = res;
      });

      http.expectOne('http://localhost:3000/meals/available-names?name=rice')
        .flush(signupResponse, {status: 204, statusText: 'No Content'});
      expect(response).toEqual(signupResponse);
      http.verify();
    });

    it('should return a 400 status if a name is already used', () => {
      let signupResponse = null;

      let errorResponse;
      recipeService.checkRecipeNameAvailability('rice').subscribe(res => {}, err => {
        errorResponse = err.error;
      });

      http.expectOne('http://localhost:3000/meals/available-names?name=rice')
        .flush(signupResponse, {status: 400, statusText: 'Bad Request'});
      expect(errorResponse).toEqual(signupResponse);
      http.verify();
    });
  });
});
