import { TestBed } from "@angular/core/testing";

import { HelpersService } from "./helpers.service";

describe("HelpersService", () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it("should be created", () => {
		const service: HelpersService = TestBed.get(HelpersService);
		expect(service).toBeTruthy();
	});

	describe("formatDate", () => {
		it("should return a date in Mon Day, Year format", () => {
			const service: HelpersService = TestBed.get(HelpersService);

			const date = service.formatDate("2019-10-08T07:45:48.214Z");
			expect(date).toEqual("Oct 08, 2019");
		});
	});
});
