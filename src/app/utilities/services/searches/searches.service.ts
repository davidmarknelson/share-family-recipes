import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { format } from 'date-fns';
// Interfaces
import { RecipeCardInfo } from './recipe-card-info';
import { AutocompleteItems } from './autocomplete-items';
// Environment 
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchesService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  newest(offset, limit): Observable<RecipeCardInfo> {
    return this.http.get<RecipeCardInfo>(`${this.apiUrl}search/newest`, { params: {
      offset: offset,
      limit: limit
    }}).pipe(
      map((res: RecipeCardInfo) => {
        this.loopResposeItems(res);
        return res;
      })
    );
  }

  oldest(offset, limit): Observable<RecipeCardInfo> {
    return this.http.get<RecipeCardInfo>(`${this.apiUrl}search/oldest`, { params: {
      offset: offset,
      limit: limit
    }}).pipe(
      map((res: RecipeCardInfo) => {
        this.loopResposeItems(res);
        return res;
      })
    );
  }

  byNamesAtoZ(offset, limit): Observable<RecipeCardInfo> {
    return this.http.get<RecipeCardInfo>(`${this.apiUrl}search/names-a-z`, { params: {
      offset: offset,
      limit: limit
    }}).pipe(
      map((res: RecipeCardInfo) => {
        this.loopResposeItems(res);
        return res;
      })
    );
  }

  byNamesZtoA(offset, limit): Observable<RecipeCardInfo> {
    return this.http.get<RecipeCardInfo>(`${this.apiUrl}search/names-z-a`, { params: {
      offset: offset,
      limit: limit
    }}).pipe(
      map((res: RecipeCardInfo) => {
        this.loopResposeItems(res);
        return res;
      })
    );
  }

  ingredientsByNewest(offset, limit, ingredientsArray: Array<string>): Observable<RecipeCardInfo> {
    return this.http.get<RecipeCardInfo>(`${this.apiUrl}search/byingredients-newest`, { params: {
      offset: offset,
      limit: limit,
      ingredient: ingredientsArray
    }}).pipe(
      map((res: RecipeCardInfo) => {
        this.loopResposeItems(res);
        return res;
      })
    );
  }

  ingredientsByOldest(offset, limit, ingredientsArray: Array<string>): Observable<RecipeCardInfo> {
    return this.http.get<RecipeCardInfo>(`${this.apiUrl}search/byingredients-oldest`, { params: {
      offset: offset,
      limit: limit,
      ingredient: ingredientsArray
    }}).pipe(
      map((res: RecipeCardInfo) => {
        this.loopResposeItems(res);
        return res;
      })
    );
  }

  ingredientsByNameAtoZ(offset, limit, ingredientsArray: Array<string>): Observable<RecipeCardInfo> {
    return this.http.get<RecipeCardInfo>(`${this.apiUrl}search/byingredients-a-z`, { params: {
      offset: offset,
      limit: limit,
      ingredient: ingredientsArray
    }}).pipe(
      map((res: RecipeCardInfo) => {
        this.loopResposeItems(res);
        return res;
      })
    );
  }

  ingredientsByNameZtoA(offset, limit, ingredientsArray: Array<string>): Observable<RecipeCardInfo> {
    return this.http.get<RecipeCardInfo>(`${this.apiUrl}search/byingredients-z-a`, { params: {
      offset: offset,
      limit: limit,
      ingredient: ingredientsArray
    }}).pipe(
      map((res: RecipeCardInfo) => {
        this.loopResposeItems(res);
        return res;
      })
    );
  }

  byUsernameAtoZ(offset, limit, username: string): Observable<RecipeCardInfo> {
    return this.http.get<RecipeCardInfo>(`${this.apiUrl}search/byuser-a-z`, { params: {
      offset: offset,
      limit: limit,
      username: username
    }}).pipe(
      map((res: RecipeCardInfo) => {
        this.loopResposeItems(res);
        return res;
      })
    );
  }

  byUsernameZtoA(offset, limit, username: string): Observable<RecipeCardInfo> {
    return this.http.get<RecipeCardInfo>(`${this.apiUrl}search/byuser-z-a`, { params: {
      offset: offset,
      limit: limit,
      username: username
    }}).pipe(
      map((res: RecipeCardInfo) => {
        this.loopResposeItems(res);
        return res;
      })
    );
  }

  recipesByName(name: string, limit): Observable<Array<AutocompleteItems>> {
    let formattedName = name.replace(' ', '%20');

    return this.http.get<Array<AutocompleteItems>>(`${this.apiUrl}search/name`, { params: {
      limit: limit,
      name: formattedName
    }});
  }

  loopResposeItems(res: RecipeCardInfo) {
    for (let item of res.rows) {
      item.createdAt = this.formatDate(item.createdAt);
      item.updatedAt = this.formatDate(item.updatedAt);
      item.mealPic = this.formatMealPic(item.mealPic);
    }
  }

  formatDate(date) {
    return format(new Date(date), 'MMM dd, yyyy');
  }

  formatMealPic(pic) {
    if (pic) {
      return pic;
    } else {
      return {
        mealPicName: '../../../assets/images/default-img/default-meal-pic.jpg'
      };
    }
  }
}
