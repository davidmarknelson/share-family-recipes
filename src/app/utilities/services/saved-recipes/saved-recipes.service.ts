import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { format } from 'date-fns';
// Environment 
import { environment } from '../../../../environments/environment';
// Interfaces
import { UserRecipeCardInfo } from '../searches/user-recipe-card-info';

@Injectable({
  providedIn: 'root'
})
export class SavedRecipesService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  saveRecipe(recipeId): Observable<any>  {
    return this.http.post<any>(`${this.apiUrl}saved/save`, { recipeId: recipeId});
  }

  unsaveRecipe(recipeId): Observable<any>  {
    return this.http.request<any>('delete', `${this.apiUrl}saved/unsave`, { body: { recipeId: recipeId}});
  }

  savedRecipesAtoZ(offset, limit): Observable<UserRecipeCardInfo>  {
    return this.http.get<UserRecipeCardInfo>(`${this.apiUrl}saved/a-z`, { params: {
      offset: offset,
      limit: limit
    }}).pipe(
      map((res: UserRecipeCardInfo) => {
        this.loopResposeItems(res);
        return res;
      })
    );
  }

  savedRecipesZtoA(offset, limit): Observable<UserRecipeCardInfo>  {
    return this.http.get<UserRecipeCardInfo>(`${this.apiUrl}saved/z-a`, { params: {
      offset: offset,
      limit: limit
    }}).pipe(
      map((res: UserRecipeCardInfo) => {
        this.loopResposeItems(res);
        return res;
      })
    );
  }

  loopResposeItems(res: UserRecipeCardInfo) {
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
