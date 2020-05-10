import { TestBed } from "@angular/core/testing";

import { UserFacadeService } from "@facades/user-facade/user-facade.service";

describe("UserFacadeService", () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it("should be created", () => {
		const service: UserFacadeService = TestBed.get(UserFacadeService);
		expect(service).toBeTruthy();
	});
});
