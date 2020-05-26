import { TestBed } from "@angular/core/testing";

import { HelpersService } from "./helpers.service";

const originalPicObject: object = {
	profilePicName: "https://www.awesomeapi.com/assests/picture.jpg"
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
				...originalPicObject
			});

			expect(formattedPicObject).toEqual(originalPicObject);
		});
	});

	// formatRecipePic
	describe("formatRecipePic", () => {
		it("should return the default picture path when there is no picture provided", () => {
			const defaultPicObject: object = {
				profilePicName: "assets/images/default-img/default-meal-pic.jpg"
			};
			const formattedPicObject = helpersService.formatRecipePic(null);

			expect(formattedPicObject).toEqual(defaultPicObject);
		});

		it("should return the original picture object when there is a picture provided", () => {
			const formattedPicObject = helpersService.formatRecipePic({
				...originalPicObject
			});

			expect(formattedPicObject).toEqual(originalPicObject);
		});
	});
});
