import { TestBed } from "@angular/core/testing";

import { HelpersService } from "@services/helpers/helpers.service";

const originalProfilePicObject: object = {
	profilePicName: "https://www.awesomeapi.com/assests/profilepicture.jpg"
};
const originalMealPicObject: object = {
	mealPicName: "https://www.awesomeapi.com/assests/mealpicture.jpg"
};

describe("HelpersService", () => {
	let helpersService: HelpersService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		helpersService = TestBed.get(HelpersService);
	});

	it("should be created", () => {
		expect(helpersService).toBeTruthy();
	});

	// formatDate
	describe("formatDate", () => {
		it("should return a date in Mon Day, Year format", () => {
			const date: string = helpersService.formatDate(
				"2019-10-08T07:45:48.214Z"
			);
			expect(date).toEqual("Oct 08, 2019");
		});
	});

	// formatProfilePic
	describe("formatProfilePic", () => {
		it("should return the default picture path when there is no picture provided", () => {
			const defaultPicObject: object = {
				profilePicName: "assets/images/default-img/default-profile-pic.jpg"
			};
			const formattedPicObject = helpersService.formatProfilePic(null);

			expect(formattedPicObject).toEqual(defaultPicObject);
		});

		it("should return the original picture object when there is a picture provided", () => {
			const formattedPicObject = helpersService.formatProfilePic({
				...originalProfilePicObject
			});

			expect(formattedPicObject).toEqual(originalProfilePicObject);
		});
	});

	// formatRecipePic
	describe("formatRecipePic", () => {
		it("should return the default picture path when there is no picture provided", () => {
			const defaultPicObject: object = {
				mealPicName: "assets/images/default-img/default-meal-pic.jpg"
			};
			const formattedPicObject = helpersService.formatRecipePic(null);

			expect(formattedPicObject).toEqual(defaultPicObject);
		});

		it("should return the original picture object when there is a picture provided", () => {
			const formattedPicObject = helpersService.formatRecipePic({
				...originalMealPicObject
			});

			expect(formattedPicObject).toEqual(originalMealPicObject);
		});
	});
});
