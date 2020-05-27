import { Injectable } from "@angular/core";
import { format } from "date-fns";

@Injectable({
	providedIn: "root"
})
export class HelpersService {
	constructor() {}

	formatDate(date) {
		return format(new Date(date), "MMM dd, yyyy");
	}

	formatProfilePic(pic) {
		return pic
			? pic
			: { profilePicName: "assets/images/default-img/default-profile-pic.jpg" };
	}

	formatRecipePic(pic) {
		return pic
			? pic
			: { mealPicName: "assets/images/default-img/default-meal-pic.jpg" };
	}
}
