import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// Environment 
import { environment } from '../../../../environments/environment';

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


}
