import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { LikesService } from './likes.service';

describe('LikesService', () => {
  let likesService: LikesService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [LikesService]
    });
    
    http = TestBed.get(HttpTestingController);
    likesService = TestBed.get(LikesService);
  });

  it('should be created', () => {
    const service: LikesService = TestBed.get(LikesService);
    expect(service).toBeTruthy();
  });

  describe('addLike', () => {
    it('should return a message when the recipe is successfully liked', () => {
      const likeResponse = { 
        message: 'Meal successfully liked.'
      };
      let response;

      likesService.addLike(1).subscribe(res => {
        response = res;
      });

      http.expectOne('http://localhost:3000/likes/add').flush(likeResponse);
      expect(response).toEqual(likeResponse);
      http.verify();
    });

    it('should return an error message when the recipe is unsuccessfully liked', () => {
      const likeResponse = 'There was an error liking this meal.';
      let errorResponse;

      likesService.addLike(1).subscribe(res => {}, err => {
        errorResponse = err;
      });

      http.expectOne('http://localhost:3000/likes/add').flush({message: likeResponse}, {status: 500, statusText: 'Server Error'});
      expect(errorResponse.error.message).toEqual(likeResponse);
      http.verify();
    });
  });

  describe('removeLike', () => {
    it('should return a message when the recipe is successfully liked', () => {
      const likeResponse = { 
        message: 'Meal successfully unliked.'
      };
      let response;

      likesService.removeLike(1).subscribe(res => {
        response = res;
      });

      http.expectOne('http://localhost:3000/likes/remove').flush(likeResponse);
      expect(response).toEqual(likeResponse);
      http.verify();
    });

    it('should return an error message when the recipe is unsuccessfully liked', () => {
      const likeResponse = 'There was an error unliking this meal.';
      let errorResponse;

      likesService.removeLike(1).subscribe(res => {}, err => {
        errorResponse = err;
      });

      http.expectOne('http://localhost:3000/likes/remove').flush({message: likeResponse}, {status: 500, statusText: 'Server Error'});
      expect(errorResponse.error.message).toEqual(likeResponse);
      http.verify();
    });
  });
});
