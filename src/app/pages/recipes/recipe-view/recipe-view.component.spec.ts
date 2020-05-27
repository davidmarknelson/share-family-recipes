import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { DebugElement } from "@angular/core";
import { RecipeViewComponent } from "./recipe-view.component";
import { RecipesModule } from "../recipes.module";
import { ActivatedRoute } from "@angular/router";
import { RecipeService } from "@utilities/services/recipe/recipe.service";
import { AuthService } from "@utilities/services/auth/auth.service";
import { of, throwError, Observable } from "rxjs";
import { By } from "@angular/platform-browser";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RecipeTestingObjects } from "@utilities/test-utilities/recipeTestingObjects";

// This holds objects used in tests.
const testingObj = new RecipeTestingObjects();

// These 2 sections are used to select elements in tests.
let fixture: ComponentFixture<RecipeViewComponent>;
let errorMsg: DebugElement;
let title: DebugElement;
let editBtn: DebugElement;
let iframeVideo: DebugElement;

function selectElements() {
	errorMsg = fixture.debugElement.query(By.css(".message-body"));
	title = fixture.debugElement.query(By.css("h1.title"));
	editBtn = fixture.debugElement.query(By.css("[data-test=edit-btn]"));
	iframeVideo = fixture.debugElement.query(By.css("iframe"));
}

let recipeItem;
class MockActivatedRoute {
	params = new Observable(observer => {
		const recipe = {
			recipe: recipeItem // declared above to be assigned in tests
		};
		observer.next(recipe);
		observer.complete();
	});
}

class MockRecipeService {
	getRecipeByName(name) {
		return of();
	}
	getRecipeById(id) {
		return of();
	}
}

class MockAuthService {
	isLoggedIn() {}
	currentUser() {}
}

describe("RecipeViewComponent", () => {
	let component: RecipeViewComponent;
	let authService: AuthService;
	let activatedRoute: ActivatedRoute;
	let recipeService: RecipeService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [RecipesModule, RouterTestingModule, HttpClientTestingModule]
		})
			.overrideComponent(RecipeViewComponent, {
				set: {
					providers: [
						{ provide: RecipeService, useClass: MockRecipeService },
						{ provide: ActivatedRoute, useClass: MockActivatedRoute },
						{ provide: AuthService, useClass: MockAuthService }
					]
				}
			})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(RecipeViewComponent);
		component = fixture.componentInstance;
		authService = fixture.debugElement.injector.get(AuthService);
		recipeService = fixture.debugElement.injector.get(RecipeService);
		activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
	});

	it("should create", () => {
		recipeItem = "1";

		fixture.detectChanges();

		expect(component).toBeTruthy();
	});

	describe("error", () => {
		it("should show an error message with the recipe id when the recipe does not exist", () => {
			recipeItem = "1";

			spyOn(recipeService, "getRecipeById").and.callFake(() => {
				return throwError({
					error: {
						message: "That meal does not exist."
					}
				});
			});

			fixture.detectChanges();
			selectElements();

			expect(recipeService.getRecipeById).toHaveBeenCalled();
			expect(errorMsg.nativeElement.innerText).toContain(
				"That meal does not exist."
			);
		});

		it("should show an error message with the recipe name when the recipe does not exist", () => {
			recipeItem = "eggs";

			spyOn(recipeService, "getRecipeByName").and.callFake(() => {
				return throwError({
					error: {
						message: "That meal does not exist."
					}
				});
			});

			fixture.detectChanges();
			selectElements();

			expect(recipeService.getRecipeByName).toHaveBeenCalled();
			expect(errorMsg.nativeElement.innerText).toContain(
				"That meal does not exist."
			);
		});
	});

	describe("recipe", () => {
		it("should populate the page with the information and show the edit button for the creator", () => {
			recipeItem = "1";

			spyOn(authService, "isLoggedIn").and.callFake(() => true);
			spyOn(authService, "currentUser").and.callFake(() => {
				return { ...testingObj.nonAdminObj };
			});

			spyOn(recipeService, "getRecipeById").and.callFake(() => {
				return of({ ...testingObj.recipeFullObj });
			});

			fixture.detectChanges();
			selectElements();

			expect(recipeService.getRecipeById).toHaveBeenCalled();
			expect(title.nativeElement.innerText).toEqual("Eggs and Rice");
			expect(editBtn).toBeTruthy();
			expect(iframeVideo).toBeTruthy();
		});

		it("should populate the page with the information and show the edit button for the creator and call getRecipeByName", () => {
			recipeItem = "eggs";

			spyOn(authService, "isLoggedIn").and.callFake(() => true);
			spyOn(authService, "currentUser").and.callFake(() => {
				return { ...testingObj.nonAdminObj };
			});

			spyOn(recipeService, "getRecipeByName").and.callFake(() => {
				return of({ ...testingObj.recipeFullObj });
			});

			fixture.detectChanges();
			selectElements();

			expect(recipeService.getRecipeByName).toHaveBeenCalled();
			expect(title.nativeElement.innerText).toEqual("Eggs and Rice");
			expect(editBtn).toBeTruthy();
			expect(iframeVideo).toBeTruthy();
		});

		it("should populate the page with the information and not show the edit button", () => {
			recipeItem = "1";

			spyOn(recipeService, "getRecipeById").and.callFake(() => {
				return of({ ...testingObj.recipeFullObj });
			});

			fixture.detectChanges();
			selectElements();

			expect(recipeService.getRecipeById).toHaveBeenCalled();
			expect(title.nativeElement.innerText).toEqual("Eggs and Rice");
			expect(editBtn).toBeFalsy();
		});
	});
});
