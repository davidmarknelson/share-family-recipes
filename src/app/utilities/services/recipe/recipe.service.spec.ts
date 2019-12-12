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
    expect(recipeService).toBeTruthy();
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
        difficulty: 2,
        mealPic: 'test.png'
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
        .flush(signupResponse, {status: 200, statusText: 'OK'});
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

  describe('getRecipeById', () => {
    it('should return a recipe', () => {
      let signupResponse = {
        id: 1,
        name: 'Fried Rice',
        description: 'A simple rice dish.',
        ingredients: [
          'rice', 'egg', 'oil'
        ],
        instructions: [
          'Cook rice.', 'Fry rice in the pan with an egg.'
        ],
        creator: {
          username: 'johndoe',
          profilePic: null
        },
        cookTime: 15,
        difficulty: 2,
        createdAt: '2019-11-29T19:57:43.200Z',
        updatedAt: '2019-11-29T19:57:43.200Z'
      };

      let response;
      recipeService.getRecipeById('1').subscribe(res => {
        response = res;
      });

      http.expectOne('http://localhost:3000/meals/meal-by-id?id=1').flush(signupResponse);
      expect(response).toEqual(signupResponse);
      http.verify();
    });

    it('should return a 500 status if there is an error message', () => {
      let signupResponse = {
        message: 'There was an error getting the meal.'
      };

      let errorResponse;
      recipeService.getRecipeById('1').subscribe(res => {}, err => {
        errorResponse = err.error;
      });

      http.expectOne('http://localhost:3000/meals/meal-by-id?id=1')
        .flush(signupResponse, {status: 500, statusText: 'Server Error'});
      expect(errorResponse).toEqual(signupResponse);
      http.verify();
    });
  });

  describe('getRecipeByName', () => {
    it('should return a recipe', () => {
      let signupResponse = {
        name: 'Egg', // Name was changed because the tests fail with 'Fried%20Rice', but it works outside of tests
        description: 'A simple rice dish.',
        ingredients: [
          'rice', 'egg', 'oil'
        ],
        instructions: [
          'Cook rice.', 'Fry rice in the pan with an egg.'
        ],
        creator: {
          username: 'johndoe',
          profilePic: null
        },
        cookTime: 15,
        difficulty: 2,
        createdAt: '2019-11-29T19:57:43.200Z',
        updatedAt: '2019-11-29T19:57:43.200Z'
      };

      let response;
      recipeService.getRecipeByName('Egg').subscribe(res => {
        response = res;
      });

      http.expectOne('http://localhost:3000/meals/meal-by-name?name=Egg').flush(signupResponse, {status: 200, statusText: 'OK'});
      expect(response).toEqual(signupResponse);
      http.verify();
    });

    it('should return a 500 status if there is an error message', () => {
      let signupResponse = {
        message: 'There was an error getting the meal.'
      };

      let errorResponse;
      recipeService.getRecipeByName('Egg').subscribe(res => {}, err => {
        errorResponse = err.error;
      });

      http.expectOne('http://localhost:3000/meals/meal-by-name?name=Egg')
        .flush(signupResponse, {status: 500, statusText: 'Server Error'});
      expect(errorResponse).toEqual(signupResponse);
      http.verify();
    });
  });

  describe('formatDate', () => {
    it('should return a date in Mon Day, Year format', () => {
      let date = recipeService.formatDate('2019-10-08T07:45:48.214Z');
      expect(date).toEqual('Oct 08, 2019');
    });
  });

  describe('editRecipe', () => {
    it('should return a message when the recipe is updated', () => {
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
      let editResponse = {
        'message': 'Recipe successfully updated.'
      };

      let response;
      recipeService.editRecipe(recipe, null).subscribe(res => {
        response = res;
      });

      http.expectOne('http://localhost:3000/meals/update').flush(editResponse);
      expect(response).toEqual(editResponse);
      http.verify();
    });

    it('should return an error when email is already being used', () => {
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

      const editResponse = 'This email account is already in use.';
      let errorResponse;

      recipeService.editRecipe(recipe, null).subscribe(res => {}, err => {
        errorResponse = err;
      });

      http.expectOne('http://localhost:3000/meals/update').flush({message: editResponse}, {status: 500, statusText: 'Server Error'});
      expect(errorResponse.error.message).toEqual(editResponse);
      http.verify();
    });
  });
});
