import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { format } from 'date-fns';
// Interfaces
import { Recipe } from './recipe';
// Environment 
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  createRecipe(fields: Recipe, file): Observable<any>  {
    let fd = new FormData();
    fd.append('name', fields.name);
    fd.append('description', fields.description);
    fd.append('ingredients', JSON.stringify(fields.ingredients));
    fd.append('instructions', JSON.stringify(fields.instructions));
    fd.append('cookTime', String(fields.cookTime));
    fd.append('difficulty', String(fields.difficulty));
    if (fields.originalRecipeUrl) fd.append('originalRecipeUrl', fields.originalRecipeUrl);
    if (fields.youtubeUrl) fd.append('youtubeUrl', fields.youtubeUrl);
    if (file) fd.append('mealPic', file, fields.mealPic);

    return this.http.post<any>(`${this.apiUrl}meals/create`, fd, { 
      headers: { 
        header: 'multipart/form-data'
      }
    });
  }

  checkRecipeNameAvailability(name: string): Observable<any>  {
    return this.http.get(`${this.apiUrl}meals/available-names`, { params: {
      name: name
    }});
  }
}
