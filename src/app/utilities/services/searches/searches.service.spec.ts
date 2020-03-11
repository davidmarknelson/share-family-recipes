import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { SearchesService } from './searches.service';

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
        username: 'johndoe'
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

describe('SearchesService', () => {
  let searchesService: SearchesService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [SearchesService]
    });
    
    http = TestBed.get(HttpTestingController);
    searchesService = TestBed.get(SearchesService);
  });

  it('should be created', () => {
    expect(searchesService).toBeTruthy();
  });

  describe('formatDate', () => {
    it('should return a date in Mon Day, Year format', () => {
      let date = searchesService.formatDate('2019-10-08T07:45:48.214Z');
      expect(date).toEqual('Oct 08, 2019');
    });
  });

  describe('newest', () => {
    it('should return an array of recipes', () => {
      let signupResponse = recipesObj;

      let response;
      searchesService.newest(0, 10).subscribe(res => {
        response = res;
      });

      http.expectOne('http://localhost:3000/search/newest?offset=0&limit=10')
        .flush(signupResponse, {status: 200, statusText: 'OK'});
      expect(response).toEqual(signupResponse);
      http.verify();
    });

    it('should return a 404 status if there are no recipes', () => {
      let signupResponse = 'There are no recipes.';

      let errorResponse;
      searchesService.newest(0, 10).subscribe(res => {}, err => {
        errorResponse = err.error;
      });

      http.expectOne('http://localhost:3000/search/newest?offset=0&limit=10')
        .flush(signupResponse, {status: 404, statusText: 'Not Found'});
      expect(errorResponse).toEqual(signupResponse);
      http.verify();
    });
  });

  describe('oldest', () => {
    it('should return an array of recipes', () => {
      let signupResponse = recipesObj;

      let response;
      searchesService.oldest(0, 10).subscribe(res => {
        response = res;
      });

      http.expectOne('http://localhost:3000/search/oldest?offset=0&limit=10')
        .flush(signupResponse, {status: 200, statusText: 'OK'});
      expect(response).toEqual(signupResponse);
      http.verify();
    });

    it('should return a 404 status if there are no recipes', () => {
      let signupResponse = 'There are no recipes.';

      let errorResponse;
      searchesService.oldest(0, 10).subscribe(res => {}, err => {
        errorResponse = err.error;
      });

      http.expectOne('http://localhost:3000/search/oldest?offset=0&limit=10')
        .flush(signupResponse, {status: 404, statusText: 'Not Found'});
      expect(errorResponse).toEqual(signupResponse);
      http.verify();
    });
  });

  describe('byNamesAtoZ', () => {
    it('should return an array of recipes', () => {
      let signupResponse = recipesObj;

      let response;
      searchesService.byNamesAtoZ(0, 10).subscribe(res => {
        response = res;
      });

      http.expectOne('http://localhost:3000/search/names-a-z?offset=0&limit=10')
        .flush(signupResponse, {status: 200, statusText: 'OK'});
      expect(response).toEqual(signupResponse);
      http.verify();
    });

    it('should return a 404 status if there are no recipes', () => {
      let signupResponse = 'There are no recipes.';

      let errorResponse;
      searchesService.byNamesAtoZ(0, 10).subscribe(res => {}, err => {
        errorResponse = err.error;
      });

      http.expectOne('http://localhost:3000/search/names-a-z?offset=0&limit=10')
        .flush(signupResponse, {status: 404, statusText: 'Not Found'});
      expect(errorResponse).toEqual(signupResponse);
      http.verify();
    });
  });

  describe('byNamesZtoA', () => {
    it('should return an array of recipes', () => {
      let signupResponse = recipesObj;

      let response;
      searchesService.byNamesZtoA(0, 10).subscribe(res => {
        response = res;
      });

      http.expectOne('http://localhost:3000/search/names-z-a?offset=0&limit=10')
        .flush(signupResponse, {status: 200, statusText: 'OK'});
      expect(response).toEqual(signupResponse);
      http.verify();
    });

    it('should return a 404 status if there are no recipes', () => {
      let signupResponse = 'There are no recipes.';

      let errorResponse;
      searchesService.byNamesZtoA(0, 10).subscribe(res => {}, err => {
        errorResponse = err.error;
      });

      http.expectOne('http://localhost:3000/search/names-z-a?offset=0&limit=10')
        .flush(signupResponse, {status: 404, statusText: 'Not Found'});
      expect(errorResponse).toEqual(signupResponse);
      http.verify();
    });
  });

  describe('ingredientsByNewest', () => {
    it('should return an array of recipes', () => {
      let signupResponse = recipesObj;

      let response;
      searchesService.ingredientsByNewest(0, 10, ['egg']).subscribe(res => {
        response = res;
      });

      http.expectOne('http://localhost:3000/search/byingredients-newest?offset=0&limit=10&ingredient=egg')
        .flush(signupResponse, {status: 200, statusText: 'OK'});
      expect(response).toEqual(signupResponse);
      http.verify();
    });

    it('should return a 404 status if there are no recipes', () => {
      let signupResponse = 'There are no recipes.';

      let errorResponse;
      searchesService.ingredientsByNewest(0, 10, ['egg']).subscribe(res => {}, err => {
        errorResponse = err.error;
      });

      http.expectOne('http://localhost:3000/search/byingredients-newest?offset=0&limit=10&ingredient=egg')
        .flush(signupResponse, {status: 404, statusText: 'Not Found'});
      expect(errorResponse).toEqual(signupResponse);
      http.verify();
    });
  });

  describe('ingredientsByOldest', () => {
    it('should return an array of recipes', () => {
      let signupResponse = recipesObj;

      let response;
      searchesService.ingredientsByOldest(0, 10, ['egg']).subscribe(res => {
        response = res;
      });

      http.expectOne('http://localhost:3000/search/byingredients-oldest?offset=0&limit=10&ingredient=egg')
        .flush(signupResponse, {status: 200, statusText: 'OK'});
      expect(response).toEqual(signupResponse);
      http.verify();
    });

    it('should return a 404 status if there are no recipes', () => {
      let signupResponse = 'There are no recipes.';

      let errorResponse;
      searchesService.ingredientsByOldest(0, 10, ['egg']).subscribe(res => {}, err => {
        errorResponse = err.error;
      });

      http.expectOne('http://localhost:3000/search/byingredients-oldest?offset=0&limit=10&ingredient=egg')
        .flush(signupResponse, {status: 404, statusText: 'Not Found'});
      expect(errorResponse).toEqual(signupResponse);
      http.verify();
    });
  });

  describe('ingredientsByNameAtoZ', () => {
    it('should return an array of recipes', () => {
      let signupResponse = recipesObj;

      let response;
      searchesService.ingredientsByNameAtoZ(0, 10, ['egg']).subscribe(res => {
        response = res;
      });

      http.expectOne('http://localhost:3000/search/byingredients-a-z?offset=0&limit=10&ingredient=egg')
        .flush(signupResponse, {status: 200, statusText: 'OK'});
      expect(response).toEqual(signupResponse);
      http.verify();
    });

    it('should return a 404 status if there are no recipes', () => {
      let signupResponse = 'There are no recipes.';

      let errorResponse;
      searchesService.ingredientsByNameAtoZ(0, 10, ['egg']).subscribe(res => {}, err => {
        errorResponse = err.error;
      });

      http.expectOne('http://localhost:3000/search/byingredients-a-z?offset=0&limit=10&ingredient=egg')
        .flush(signupResponse, {status: 404, statusText: 'Not Found'});
      expect(errorResponse).toEqual(signupResponse);
      http.verify();
    });
  });

  describe('ingredientsByNameZtoA', () => {
    it('should return an array of recipes', () => {
      let signupResponse = recipesObj;

      let response;
      searchesService.ingredientsByNameZtoA(0, 10, ['egg']).subscribe(res => {
        response = res;
      });

      http.expectOne('http://localhost:3000/search/byingredients-z-a?offset=0&limit=10&ingredient=egg')
        .flush(signupResponse, {status: 200, statusText: 'OK'});
      expect(response).toEqual(signupResponse);
      http.verify();
    });

    it('should return a 404 status if there are no recipes', () => {
      let signupResponse = 'There are no recipes.';

      let errorResponse;
      searchesService.ingredientsByNameZtoA(0, 10, ['egg']).subscribe(res => {}, err => {
        errorResponse = err.error;
      });

      http.expectOne('http://localhost:3000/search/byingredients-z-a?offset=0&limit=10&ingredient=egg')
        .flush(signupResponse, {status: 404, statusText: 'Not Found'});
      expect(errorResponse).toEqual(signupResponse);
      http.verify();
    });
  });

  describe('byUsernameAtoZ', () => {
    it('should return an array of recipes', () => {
      let signupResponse = recipesObj;

      let response;
      searchesService.byUsernameAtoZ(0, 10, 'johndoe').subscribe(res => {
        response = res;
      });

      http.expectOne('http://localhost:3000/search/byuser-a-z?offset=0&limit=10&username=johndoe')
        .flush(signupResponse, {status: 200, statusText: 'OK'});
      expect(response).toEqual(signupResponse);
      http.verify();
    });

    it('should return an array of recipes and encode the username', () => {
      let signupResponse = recipesObj;

      let response;
      searchesService.byUsernameAtoZ(0, 10, 'johndoe#1').subscribe(res => {
        response = res;
      });

      http.expectOne('http://localhost:3000/search/byuser-a-z?offset=0&limit=10&username=johndoe%231')
        .flush(signupResponse, {status: 200, statusText: 'OK'});
      expect(response).toEqual(signupResponse);
      http.verify();
    });

    it('should return a 404 status if there are no recipes', () => {
      let signupResponse = 'There are no recipes.';

      let errorResponse;
      searchesService.byUsernameAtoZ(0, 10, 'johndoe').subscribe(res => {}, err => {
        errorResponse = err.error;
      });

      http.expectOne('http://localhost:3000/search/byuser-a-z?offset=0&limit=10&username=johndoe')
        .flush(signupResponse, {status: 404, statusText: 'Not Found'});
      expect(errorResponse).toEqual(signupResponse);
      http.verify();
    });
  });

  describe('byUsernameZtoA', () => {
    it('should return an array of recipes', () => {
      let signupResponse = recipesObj;

      let response;
      searchesService.byUsernameZtoA(0, 10, 'johndoe').subscribe(res => {
        response = res;
      });

      http.expectOne('http://localhost:3000/search/byuser-z-a?offset=0&limit=10&username=johndoe')
        .flush(signupResponse, {status: 200, statusText: 'OK'});
      expect(response).toEqual(signupResponse);
      http.verify();
    });

    it('should return an array of recipes and encode the username', () => {
      let signupResponse = recipesObj;

      let response;
      searchesService.byUsernameZtoA(0, 10, 'johndoe#1').subscribe(res => {
        response = res;
      });

      http.expectOne('http://localhost:3000/search/byuser-z-a?offset=0&limit=10&username=johndoe%231')
        .flush(signupResponse, {status: 200, statusText: 'OK'});
      expect(response).toEqual(signupResponse);
      http.verify();
    });

    it('should return a 404 status if there are no recipes', () => {
      let signupResponse = 'There are no recipes.';

      let errorResponse;
      searchesService.byUsernameZtoA(0, 10, 'johndoe').subscribe(res => {}, err => {
        errorResponse = err.error;
      });

      http.expectOne('http://localhost:3000/search/byuser-z-a?offset=0&limit=10&username=johndoe')
        .flush(signupResponse, {status: 404, statusText: 'Not Found'});
      expect(errorResponse).toEqual(signupResponse);
      http.verify();
    });
  });
  
  describe('recipesByName', () => {
    it('should return an array of recipes', () => {
      let signupResponse = recipesObj;

      let response;
      searchesService.recipesByName('rice', 10).subscribe(res => {
        response = res;
      });

      http.expectOne('http://localhost:3000/search/name?limit=10&name=rice')
        .flush(signupResponse, {status: 200, statusText: 'OK'});
      expect(response).toEqual(signupResponse);
      http.verify();
    });

    it('should return an array of recipes and encode the username', () => {
      let signupResponse = recipesObj;

      let response;
      searchesService.recipesByName('rice#1', 10).subscribe(res => {
        response = res;
      });

      http.expectOne('http://localhost:3000/search/name?limit=10&name=rice%231')
        .flush(signupResponse, {status: 200, statusText: 'OK'});
      expect(response).toEqual(signupResponse);
      http.verify();
    });

    it('should return a 404 status if there are no recipes', () => {
      let signupResponse = null;

      let errorResponse;
      searchesService.recipesByName('rice', 10).subscribe(res => {}, err => {
        errorResponse = err.error;
      });

      http.expectOne('http://localhost:3000/search/name?limit=10&name=rice')
        .flush(signupResponse, {status: 404, statusText: 'Not Found'});
      expect(errorResponse).toEqual(signupResponse);
      http.verify();
    });
  });
});
