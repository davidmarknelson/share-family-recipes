import { TestBed } from "@angular/core/testing";
import {
	HttpClientTestingModule,
	HttpTestingController,
} from "@angular/common/http/testing";

import { SavedRecipesService } from "./saved-recipes.service";
import { UserRecipeCardInfo } from "../../interfaces/user-recipe-card-info";

const recipesObj: UserRecipeCardInfo = {
	count: 1,
	username: "johndoe",
	profilePic: {
		profilePicName: null,
	},
	id: 1,
	rows: [
		{
			id: 1,
			name: "Rice",
			creatorId: 1,
			mealPic: {
				mealPicName: "picture.jpeg",
			},
			creator: {
				username: "johndoe",
			},
			likes: [],
			description: "An easy rice recipe",
			cookTime: 10,
			difficulty: 1,
			createdAt: "Oct 08, 2019",
			updatedAt: "Oct 08, 2019",
		},
	],
};

describe("SavedRecipesService", () => {
	let savedRecipesService: SavedRecipesService;
	let http: HttpTestingController;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [SavedRecipesService],
		});

		http = TestBed.get(HttpTestingController);
		savedRecipesService = TestBed.get(SavedRecipesService);
	});

	it("should be created", () => {
		expect(savedRecipesService).toBeTruthy();
	});

	describe("saveRecipe", () => {
		it("should return a message when the recipe is successfully liked", () => {
			const likeResponse = {
				message: "Recipe successfully saved.",
			};
			let response;

			savedRecipesService.saveRecipe(1).subscribe(res => {
				response = res;
			});

			http.expectOne("http://localhost:3000/saved/save").flush(likeResponse);
			expect(response).toEqual(likeResponse);
			http.verify();
		});

		it("should return an error message when the recipe is unsuccessfully liked", () => {
			const likeResponse = "There was an error saving this recipe.";
			let errorResponse;

			savedRecipesService.saveRecipe(1).subscribe(
				res => {},
				err => {
					errorResponse = err;
				}
			);

			http
				.expectOne("http://localhost:3000/saved/save")
				.flush(
					{ message: likeResponse },
					{ status: 500, statusText: "Server Error" }
				);
			expect(errorResponse.error.message).toEqual(likeResponse);
			http.verify();
		});
	});

	describe("unsaveRecipe", () => {
		it("should return a message when the recipe is successfully liked", () => {
			const likeResponse = {
				message: "Recipe successfully unsaved.",
			};
			let response;

			savedRecipesService.unsaveRecipe(1).subscribe(res => {
				response = res;
			});

			http.expectOne("http://localhost:3000/saved/unsave").flush(likeResponse);
			expect(response).toEqual(likeResponse);
			http.verify();
		});

		it("should return an error message when the recipe is unsuccessfully liked", () => {
			const likeResponse = "There was an error unsaving this recipe.";
			let errorResponse;

			savedRecipesService.unsaveRecipe(1).subscribe(
				res => {},
				err => {
					errorResponse = err;
				}
			);

			http
				.expectOne("http://localhost:3000/saved/unsave")
				.flush(
					{ message: likeResponse },
					{ status: 500, statusText: "Server Error" }
				);
			expect(errorResponse.error.message).toEqual(likeResponse);
			http.verify();
		});
	});

	describe("savedRecipesAtoZ", () => {
		it("should return an array of saved recipes", () => {
			let response;

			savedRecipesService.savedRecipesAtoZ(0, 9).subscribe(res => {
				response = res;
			});

			http
				.expectOne("http://localhost:3000/saved/a-z?offset=0&limit=9")
				.flush(recipesObj);
			expect(response).toEqual(recipesObj);
			http.verify();
		});

		it("should return an error message on error", () => {
			const likeResponse =
				"There was an error getting your list of saved recipes.";
			let errorResponse;

			savedRecipesService.savedRecipesAtoZ(0, 9).subscribe(
				res => {},
				err => {
					errorResponse = err;
				}
			);

			http
				.expectOne("http://localhost:3000/saved/a-z?offset=0&limit=9")
				.flush(
					{ message: likeResponse },
					{ status: 500, statusText: "Server Error" }
				);
			expect(errorResponse.error.message).toEqual(likeResponse);
			http.verify();
		});
	});

	describe("savedRecipesZtoA", () => {
		it("should return an array of saved recipes", () => {
			let response;

			savedRecipesService.savedRecipesZtoA(0, 9).subscribe(res => {
				response = res;
			});

			http
				.expectOne("http://localhost:3000/saved/z-a?offset=0&limit=9")
				.flush(recipesObj);
			expect(response).toEqual(recipesObj);
			http.verify();
		});

		it("should return an error message on error", () => {
			const likeResponse =
				"There was an error getting your list of saved recipes.";
			let errorResponse;

			savedRecipesService.savedRecipesZtoA(0, 9).subscribe(
				res => {},
				err => {
					errorResponse = err;
				}
			);

			http
				.expectOne("http://localhost:3000/saved/z-a?offset=0&limit=9")
				.flush(
					{ message: likeResponse },
					{ status: 500, statusText: "Server Error" }
				);
			expect(errorResponse.error.message).toEqual(likeResponse);
			http.verify();
		});
	});
});
