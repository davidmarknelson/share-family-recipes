import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { SavedRecipesService } from './saved-recipes.service';

describe('SavedRecipesService', () => {
  let savedRecipesService: SavedRecipesService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [SavedRecipesService]
    });
    
    http = TestBed.get(HttpTestingController);
    savedRecipesService = TestBed.get(SavedRecipesService);
  });

  it('should be created', () => {
    expect(savedRecipesService).toBeTruthy();
  });

  describe('saveRecipe', () => {
    it('should return a message when the recipe is successfully liked', () => {
      const likeResponse = { 
        message: 'Recipe successfully saved.'
      };
      let response;

      savedRecipesService.saveRecipe(1).subscribe(res => {
        response = res;
      });

      http.expectOne('http://localhost:3000/saved/save').flush(likeResponse);
      expect(response).toEqual(likeResponse);
      http.verify();
    });

    it('should return an error message when the recipe is unsuccessfully liked', () => {
      const likeResponse = 'There was an error saving this recipe.';
      let errorResponse;

      savedRecipesService.saveRecipe(1).subscribe(res => {}, err => {
        errorResponse = err;
      });

      http.expectOne('http://localhost:3000/saved/save').flush({message: likeResponse}, {status: 500, statusText: 'Server Error'});
      expect(errorResponse.error.message).toEqual(likeResponse);
      http.verify();
    });
  });

  describe('unsaveRecipe', () => {
    it('should return a message when the recipe is successfully liked', () => {
      const likeResponse = { 
        message: 'Recipe successfully unsaved.'
      };
      let response;

      savedRecipesService.unsaveRecipe(1).subscribe(res => {
        response = res;
      });

      http.expectOne('http://localhost:3000/saved/unsave').flush(likeResponse);
      expect(response).toEqual(likeResponse);
      http.verify();
    });

    it('should return an error message when the recipe is unsuccessfully liked', () => {
      const likeResponse = 'There was an error unsaving this recipe.';
      let errorResponse;

      savedRecipesService.unsaveRecipe(1).subscribe(res => {}, err => {
        errorResponse = err;
      });

      http.expectOne('http://localhost:3000/saved/unsave').flush({message: likeResponse}, {status: 500, statusText: 'Server Error'});
      expect(errorResponse.error.message).toEqual(likeResponse);
      http.verify();
    });
  });
});
