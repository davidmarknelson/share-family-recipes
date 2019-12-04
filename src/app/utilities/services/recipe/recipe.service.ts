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
        // res.ingredients = this.formatIngredients(res.ingredients);
        // res.instructions = this.formatInstructions(res.instructions);
        res.mealPic = this.formatMealPic(res.mealPic);
        // res.originalRecipeUrl = this.formatOriginalRecipeUrl(res.originalRecipeUrl);
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
        // res.ingredients = this.formatIngredients(res.ingredients);
        // res.instructions = this.formatInstructions(res.instructions);
        res.mealPic = this.formatMealPic(res.mealPic);
        // res.originalRecipeUrl = this.formatOriginalRecipeUrl(res.originalRecipeUrl);
        res.creator.profilePic = this.formatProfilePic(res.creator.profilePic);
        return res;
      })
    );
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
        mealPicName: '../../../assets/images/default-img/default-meal-pic.jpg'
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
        profilePicName: '../../../assets/images/default-img/default-profile-pic.jpg'
      };
    }
  }

  // formatIngredients(ingredients) {
  //   let tempArray = [];
  //   for (let ingredient of ingredients) {
  //     let obj = JSON.parse(ingredient);
  //     tempArray.push(obj.ingredient);
  //   }
  //   return tempArray;
  // }

  // formatInstructions(instructions) {
  //   let tempArray = [];
  //   for (let instruction of instructions) {
  //     let obj = JSON.parse(instruction);
  //     tempArray.push(obj.instruction);
  //   }
  //   return tempArray;
  // }

  // formatOriginalRecipeUrl(url: string) {
  //   if (!url.startsWith('http://') || !url.startsWith('https://')) {
  //     return `http://${url}`;
  //   }
  // }
}
