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

  createRecipe(fields, file): Observable<Recipe>  {
    // Formarray makes the ingredients and instructions fields into the objects  
    // {ingredient: ''}. These functions format the fields into the array of only the 
    // values
    fields.ingredients = this.formatIngredients(fields.ingredients);
    fields.instructions = this.formatInstructions(fields.instructions);

    let fd = new FormData();
    for (let key of Object.keys(fields)) {
      if (fields[key] && (key !== 'mealPic')) {
        fd.append(key, fields[key]);
      } else {
        fd.append(key, '');
      }
    }
    if (file) fd.append('mealPic', file, fields.mealPic);

    return this.http.post<any>(`${this.apiUrl}meals/create`, fd, { 
      headers: { 
        header: 'multipart/form-data'
      }
    });
  }

  checkRecipeNameAvailability(name: string): Observable<any>  {
    name = name.replace(' ', '%20');

    return this.http.get<any>(`${this.apiUrl}meals/available-names`, { params: {
      name: name
    }});
  }

  getRecipeById(id: string): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.apiUrl}meals/meal-by-id`, { params: {
      id: id
    }}).pipe(
      map(res => {
        res.createdAt = this.formatDate(res.createdAt);
        res.updatedAt = this.formatDate(res.updatedAt);
        res.mealPic = this.formatMealPic(res.mealPic);
        res.creator.profilePic = this.formatProfilePic(res.creator.profilePic);
        return res;
      })
    );
  }

  getRecipeByName(name: string): Observable<Recipe> {
    name = name.replace(' ', '%20');

    return this.http.get<Recipe>(`${this.apiUrl}meals/meal-by-name`, { params: {
      name: name
    }}).pipe(
      map(res => {
        res.createdAt = this.formatDate(res.createdAt);
        res.updatedAt = this.formatDate(res.updatedAt);
        res.mealPic = this.formatMealPic(res.mealPic);
        res.creator.profilePic = this.formatProfilePic(res.creator.profilePic);
        return res;
      })
    );
  }

  editRecipe(fields, file): Observable<any>  {
    // Formarray makes the ingredients and instructions fields into the objects  
    // {ingredient: ''}. These functions format the fields into the array of only the 
    // values
    fields.ingredients = this.formatIngredients(fields.ingredients);
    fields.instructions = this.formatInstructions(fields.instructions);

    let fd = new FormData();
    for (let key of Object.keys(fields)) {
      if (fields[key] && (key !== 'mealPic')) {
        fd.append(key, fields[key]);
      } else {
        fd.append(key, '');
      }
    }
    if (file) fd.append('mealPic', file, fields.mealPic);

    return this.http.put<any>(`${this.apiUrl}meals/update`, fd, { 
      headers: { 
        header: 'multipart/form-data'
      }
    });
  }

  deleteRecipe(recipeid: number): Observable<any> {
    return this.http.request<any>('DELETE', `${this.apiUrl}meals/delete`, { body: { id: recipeid }});
  }

  formatDate(date) {
    return format(new Date(date), 'MMM dd, yyyy');
  }

  formatMealPic(pic) {
    if (pic) {
      return {
        mealPicName: `${environment.apiUrl}public/images/mealPics/${pic.mealPicName}`
      };
    } else {
      return {
        mealPicName: '../../../../assets/images/default-img/default-meal-pic.jpg'
      };
    }
  }

  formatProfilePic(pic) {
    if (pic) {
      return {
        profilePicName: `${environment.apiUrl}public/images/profilePics/${pic.profilePicName}`
      }
    } else {
      return {
        profilePicName: '../../../../assets/images/default-img/default-profile-pic.jpg'
      };
    }
  }

  formatIngredients(ingredients) {
    let tempArray = [];
    for (let ingredient of ingredients) {
      tempArray.push(ingredient.ingredient);
    }
    // Formdata can only send strings
    return JSON.stringify(tempArray);
  }
  
  formatInstructions(instructions) {
    let tempArray = [];
    for (let instruction of instructions) {
      tempArray.push(instruction.instruction);
    }
    // Formdata can only send strings
    return JSON.stringify(tempArray);
  }
}
