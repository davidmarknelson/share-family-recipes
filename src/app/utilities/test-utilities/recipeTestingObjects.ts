import { UserDecodedToken } from "@utilities/interfaces/user-decoded-token";
import { Recipe } from "@utilities/interfaces/recipe";

export class RecipeTestingObjects {
	nonAdminObj: UserDecodedToken = {
		id: 1,
		isAdmin: false,
		username: "johndoe",
		iat: 1575496172,
		exp: 2180296172
	};

	adminObj: UserDecodedToken = {
		id: 1,
		isAdmin: true,
		username: "johndoe",
		iat: 1575496172,
		exp: 2180296172
	};

	recipeFullObj: Recipe = {
		id: 1,
		name: "Eggs and Rice",
		description: "A delicious and easy dish.",
		creatorId: 1,
		creator: {
			username: "johndoe",
			profilePic: {
				profilePicName: "assets/images/default-img/default-profile-pic.jpg"
			}
		},
		ingredients: ["3 eggs", "rice", "vegetables"],
		instructions: ["cooks eggs", "cook rice", "mix and serve"],
		cookTime: 20,
		difficulty: 1,
		likes: [{ userId: 1 }],
		savedRecipes: [{ userId: 1 }],
		mealPic: {
			mealPicName: "assets/images/default-img/default-meal-pic.jpg"
		},
		createdAt: "Dec 04, 2019",
		updatedAt: "Dec 04, 2019",
		originalRecipeUrl: "http://www.originalrecipe.com",
		youtubeUrl: "https://www.youtube-nocookie.com/embed/MV0F_XiR48Q"
	};

	recipeEmptyObj: Recipe = {
		id: 1,
		name: "Eggs and Rice",
		description: "A delicious and easy dish.",
		creatorId: 1,
		creator: {
			username: "johndoe",
			profilePic: null
		},
		ingredients: ["3 eggs", "rice", "vegetables"],
		instructions: ["cooks eggs", "cook rice", "mix and serve"],
		cookTime: 20,
		difficulty: 1,
		likes: [],
		savedRecipes: [],
		mealPic: null,
		createdAt: "Dec 04, 2019",
		updatedAt: "Dec 04, 2019",
		originalRecipeUrl: null,
		youtubeUrl: null
	};
}
