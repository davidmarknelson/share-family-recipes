import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { format } from "date-fns";
// Interfaces
import { Recipe } from "../../interfaces/recipe";
// Environment
import { environment } from "../../../../environments/environment";

@Injectable({
	providedIn: "root"
})
export class RecipeService {
	apiUrl = environment.apiUrl;

	constructor(private http: HttpClient) {}

	createRecipe(fields): Observable<Recipe> {
		// Formarray makes the ingredients and instructions fields into the objects
		// {ingredient: ''}. These functions format the fields into the array of only the
		// values
		fields.ingredients = this.formatIngredients(fields.ingredients);
		fields.instructions = this.formatInstructions(fields.instructions);

		return this.http.post<any>(`${this.apiUrl}meals/create`, fields);
	}

	checkRecipeNameAvailability(name: string): Observable<any> {
		return this.http.get<any>(`${this.apiUrl}meals/available-names`, {
			params: { name }
		});
	}

	getRecipeById(id: string): Observable<Recipe> {
		return this.http
			.get<Recipe>(`${this.apiUrl}meals/meal-by-id`, {
				params: { id }
			})
			.pipe(
				map(res => {
					res.createdAt = this.formatDate(res.createdAt);
					res.updatedAt = this.formatDate(res.updatedAt);
					res.mealPic = this.formatMealPic(res.mealPic);
					res.creator.profilePic = this.formatProfilePic(
						res.creator.profilePic
					);
					return res;
				})
			);
	}

	getRecipeByName(name: string): Observable<Recipe> {
		return this.http
			.get<Recipe>(`${this.apiUrl}meals/meal-by-name`, {
				params: { name }
			})
			.pipe(
				map(res => {
					res.createdAt = this.formatDate(res.createdAt);
					res.updatedAt = this.formatDate(res.updatedAt);
					res.mealPic = this.formatMealPic(res.mealPic);
					res.creator.profilePic = this.formatProfilePic(
						res.creator.profilePic
					);
					return res;
				})
			);
	}

	editRecipe(fields): Observable<any> {
		// Formarray makes the ingredients and instructions fields into the objects
		// {ingredient: ''}. These functions format the fields into the array of only the
		// values
		fields.ingredients = this.formatIngredients(fields.ingredients);
		fields.instructions = this.formatInstructions(fields.instructions);

		return this.http.put<any>(`${this.apiUrl}meals/update`, fields);
	}

	deleteRecipe(recipeid: number): Observable<any> {
		return this.http.request<any>("DELETE", `${this.apiUrl}meals/delete`, {
			body: { id: recipeid }
		});
	}

	formatDate(date) {
		return format(new Date(date), "MMM dd, yyyy");
	}

	formatMealPic(pic) {
		if (!pic) {
			return {
				mealPicName: "assets/images/default-img/default-meal-pic.jpg"
			};
		} else {
			return pic;
		}
	}

	formatProfilePic(pic) {
		if (!pic) {
			return {
				profilePicName: "assets/images/default-img/default-profile-pic.jpg"
			};
		} else {
			return pic;
		}
	}

	formatIngredients(ingredients) {
		const tempArray = [];
		for (const ingredient of ingredients) {
			tempArray.push(ingredient.ingredient);
		}
		// Formdata can only send strings
		return JSON.stringify(tempArray);
	}

	formatInstructions(instructions) {
		const tempArray = [];
		for (const instruction of instructions) {
			tempArray.push(instruction.instruction);
		}
		// Formdata can only send strings
		return JSON.stringify(tempArray);
	}
}
