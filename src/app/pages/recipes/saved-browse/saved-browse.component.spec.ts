import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SavedBrowseComponent } from "./saved-browse.component";
import { DebugElement } from "@angular/core";
import { RecipesModule } from "../recipes.module";
import { SavedRecipesService } from "../../../utilities/services/saved-recipes/saved-recipes.service";
import { AuthService } from "../../../utilities/services/auth/auth.service";
import { UserRecipeCardInfo } from "../../../utilities/interfaces/user-recipe-card-info";
import { of, throwError } from "rxjs";
import { By } from "@angular/platform-browser";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";

let fixture: ComponentFixture<SavedBrowseComponent>;
let loadingMsg: DebugElement;
let pageTitle: DebugElement;
let pageError: DebugElement;
let closePageError: DebugElement;
let noRecipesMsg: DebugElement;
let sortingSelect: DebugElement;
let amountSelect: DebugElement;
let recipeCount: DebugElement;

function selectElements() {
	loadingMsg = fixture.debugElement.query(By.css("[data-test=loading-msg]"));
	pageTitle = fixture.debugElement.query(By.css(".page-header__title"));
	pageError = fixture.debugElement.query(By.css("[data-test=errorMsg]"));
	closePageError = fixture.debugElement.query(
		By.css("[data-test=closeErrorMsg]")
	);
	noRecipesMsg = fixture.debugElement.query(
		By.css("[data-test=no-recipes-msg]")
	);
	sortingSelect = fixture.debugElement.query(
		By.css("[data-test=sorting-select]")
	);
	amountSelect = fixture.debugElement.query(
		By.css("[data-test=amount-select]")
	);
	recipeCount = fixture.debugElement.query(By.css("[data-test=recipe-count]"));
}

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
			savedRecipes: [],
			description: "An easy rice recipe",
			cookTime: 10,
			difficulty: 1,
			createdAt: "Oct 08, 2019",
			updatedAt: "Oct 08, 2019",
		},
	],
};

const recipesObjWithoutRecipes: UserRecipeCardInfo = {
	count: 1,
	username: "johndoe",
	profilePic: {
		profilePicName: null,
	},
	id: 1,
	rows: [],
};

const user = {
	id: 1,
	isAdmin: true,
	username: "johndoe",
	iat: 1575496172,
	exp: 2180296172,
};

class MockAuthService {
	currentUser() {
		return;
	}
}

class MockSavedService {
	savedRecipesAtoZ(offset, limit) {
		return of();
	}
	savedRecipesZtoA(offset, limit) {
		return of();
	}
}

describe("SavedBrowseComponent", () => {
	let component: SavedBrowseComponent;
	let authService: AuthService;
	let savedService: SavedRecipesService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [RecipesModule, RouterTestingModule, HttpClientTestingModule],
		})
			.overrideComponent(SavedBrowseComponent, {
				set: {
					providers: [
						{ provide: SavedRecipesService, useClass: MockSavedService },
						{ provide: AuthService, useClass: MockAuthService },
					],
				},
			})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SavedBrowseComponent);
		component = fixture.componentInstance;
		authService = fixture.debugElement.injector.get(AuthService);
		savedService = fixture.debugElement.injector.get(SavedRecipesService);
	});

	it("should create", () => {
		fixture.detectChanges();

		expect(component).toBeTruthy();
	});

	describe("initialization", () => {
		it("should show a loading message when the data has not returned from the database", () => {
			fixture.detectChanges();
			selectElements();

			expect(loadingMsg).toBeTruthy();
		});

		it("should populate the page with the user's recipes", () => {
			spyOn(savedService, "savedRecipesAtoZ").and.callFake(() =>
				of(recipesObj)
			);
			spyOn(authService, "currentUser").and.returnValue(user);
			spyOn(component, "getData").and.callThrough();

			fixture.detectChanges();
			selectElements();

			expect(savedService.savedRecipesAtoZ).toHaveBeenCalled();
			expect(authService.currentUser).toHaveBeenCalled();
			expect(component.getData).toHaveBeenCalled();

			expect(pageTitle.nativeElement.innerText).toContain("Saved Recipes");
			expect(recipeCount.nativeElement.innerText).toContain("1-1 of 1 recipes");
		});

		it("should show an error for a server error and not show loading when closing the error", () => {
			spyOn(savedService, "savedRecipesAtoZ").and.callFake(() => {
				return throwError({
					error: {
						message: "There was an error getting your list of saved recipes.",
					},
				});
			});
			spyOn(authService, "currentUser").and.returnValue(user);
			spyOn(component, "getData").and.callThrough();

			fixture.detectChanges();
			selectElements();

			expect(savedService.savedRecipesAtoZ).toHaveBeenCalled();
			expect(authService.currentUser).toHaveBeenCalled();
			expect(component.getData).toHaveBeenCalled();

			expect(pageError.nativeElement.innerText).toContain(
				"There was an error getting your list of saved recipes."
			);

			closePageError.nativeElement.click();
			closePageError.nativeElement.dispatchEvent(new Event("click"));
			fixture.detectChanges();
			selectElements();

			expect(loadingMsg).toBeFalsy();
		});

		it("should show an error if the user has not saved any recipes", () => {
			spyOn(savedService, "savedRecipesAtoZ").and.callFake(() =>
				of(recipesObjWithoutRecipes)
			);
			spyOn(authService, "currentUser").and.returnValue(user);
			spyOn(component, "getData").and.callThrough();

			fixture.detectChanges();
			selectElements();

			expect(savedService.savedRecipesAtoZ).toHaveBeenCalled();
			expect(authService.currentUser).toHaveBeenCalled();
			expect(component.getData).toHaveBeenCalled();

			expect(noRecipesMsg.nativeElement.innerText).toContain(
				"You have not saved any recipes."
			);
		});
	});

	describe("sorting changes", () => {
		beforeEach(() => {
			spyOn(authService, "currentUser").and.returnValue(user);
			spyOn(component, "getData").and.callThrough();
			spyOn(savedService, "savedRecipesAtoZ").and.callFake(() =>
				of(recipesObj)
			);
			spyOn(savedService, "savedRecipesZtoA").and.callFake(() =>
				of(recipesObj)
			);
			spyOn(component, "onSortingChange").and.callThrough();

			fixture.detectChanges();
			selectElements();
		});

		it("should call byUsernameZtoA when the user changes the options", () => {
			sortingSelect.nativeElement.value = "Z - A";
			sortingSelect.nativeElement.dispatchEvent(new Event("change"));
			fixture.detectChanges();

			expect(authService.currentUser).toHaveBeenCalled();
			expect(savedService.savedRecipesAtoZ).toHaveBeenCalledTimes(1);
			expect(savedService.savedRecipesZtoA).toHaveBeenCalledTimes(1);
			expect(component.getData).toHaveBeenCalled();
			expect(component.onSortingChange).toHaveBeenCalled();
		});

		it("should call byUsernameAtoZ when the user changes the options", () => {
			sortingSelect.nativeElement.value = "A - Z";
			sortingSelect.nativeElement.dispatchEvent(new Event("change"));
			fixture.detectChanges();

			expect(authService.currentUser).toHaveBeenCalled();
			expect(savedService.savedRecipesAtoZ).toHaveBeenCalledTimes(2);
			expect(savedService.savedRecipesZtoA).toHaveBeenCalledTimes(0);
			expect(component.getData).toHaveBeenCalled();
			expect(component.onSortingChange).toHaveBeenCalled();
		});
	});

	describe("amount changes", () => {
		beforeEach(() => {
			spyOn(authService, "currentUser").and.returnValue(user);
			spyOn(component, "getData").and.callThrough();
			spyOn(savedService, "savedRecipesAtoZ").and.callFake(() =>
				of(recipesObj)
			);
			spyOn(savedService, "savedRecipesZtoA");
			spyOn(component, "onAmountChange").and.callThrough();

			fixture.detectChanges();
			selectElements();
		});

		it("should call byUsernameAtoZ with a limit of 18 when the user changes the amount options", () => {
			amountSelect.nativeElement.value = "Show 18";
			amountSelect.nativeElement.dispatchEvent(new Event("change"));
			fixture.detectChanges();

			expect(authService.currentUser).toHaveBeenCalled();
			expect(savedService.savedRecipesAtoZ).toHaveBeenCalledWith(0, 18);
			expect(savedService.savedRecipesZtoA).not.toHaveBeenCalled();
			expect(component.getData).toHaveBeenCalled();
			expect(component.onAmountChange).toHaveBeenCalled();
		});

		it("should call byUsernameAtoZ with a limit of 9 when the user changes the amount options", () => {
			amountSelect.nativeElement.value = "Show 9";
			amountSelect.nativeElement.dispatchEvent(new Event("change"));
			fixture.detectChanges();

			expect(authService.currentUser).toHaveBeenCalled();
			expect(savedService.savedRecipesAtoZ).toHaveBeenCalledWith(0, 9);
			expect(savedService.savedRecipesZtoA).not.toHaveBeenCalled();
			expect(component.getData).toHaveBeenCalled();
			expect(component.onAmountChange).toHaveBeenCalled();
		});
	});
});
