import {
	async,
	ComponentFixture,
	TestBed,
	fakeAsync,
	tick
} from "@angular/core/testing";
import { SearchBarComponent } from "./search-bar.component";
import { of } from "rxjs";
import { DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";
import { SearchesService } from "@services/searches/searches.service";
import { AppModule } from "../../app.module";
import { Router } from "@angular/router";
import { SearchBarTestingObjects } from "@testUtilities/search-testing-objects";

const testingObjects = new SearchBarTestingObjects();

let fixture: ComponentFixture<SearchBarComponent>;
let searchContainer: DebugElement;
let searchInput: DebugElement;
let searchSubmitBtn: DebugElement;
let searchItemsContainer: DebugElement;
let searchItems: DebugElement[];

function selectElements() {
	searchContainer = fixture.debugElement.query(
		By.css("[data-test=searchBarContainer]")
	);
	searchInput = fixture.debugElement.query(By.css("#name"));
	searchSubmitBtn = fixture.debugElement.query(By.css("[type=submit]"));
	searchItemsContainer = fixture.debugElement.query(
		By.css("[data-test=itemsContainer]")
	);
	searchItems = fixture.debugElement.queryAll(By.css("[data-test=searchItem]"));
}

class MockRouter {
	navigate(path) {}
}

class MockSearchesService {
	recipesByName(name, limit) {
		return of();
	}
}

describe("SearchBarComponent", () => {
	let component: SearchBarComponent;
	let searchesService: SearchesService;
	let router: Router;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [AppModule]
		})
			.overrideComponent(SearchBarComponent, {
				set: {
					providers: [
						{ provide: SearchesService, useClass: MockSearchesService }
					]
				}
			})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SearchBarComponent);
		component = fixture.componentInstance;
		router = fixture.debugElement.injector.get(Router);
		searchesService = fixture.debugElement.injector.get(SearchesService);
	});

	it("should create", () => {
		fixture.detectChanges();
		expect(component).toBeTruthy();
	});

	describe("initialization", () => {
		it("should focus on the input", () => {
			fixture.detectChanges();
			selectElements();

			expect(searchInput.attributes.id).toEqual(document.activeElement.id);
		});

		it("should not show the autocomplete list", () => {
			fixture.detectChanges();
			selectElements();
			expect(searchItemsContainer).toBeFalsy();
		});
	});

	describe("search", () => {
		it("should show a list of items when the user types", fakeAsync(() => {
			spyOn(searchesService, "recipesByName").and.callFake(() =>
				of(testingObjects.searchBarTestingObjects)
			);
			fixture.detectChanges();
			selectElements();

			const input = component.form.controls["name"];
			input.setValue("egg");
			searchInput.nativeElement.dispatchEvent(new Event("input"));
			tick(1000);
			fixture.detectChanges();
			selectElements();

			expect(searchesService.recipesByName).toHaveBeenCalled();
			expect(searchItemsContainer).toBeTruthy();
			expect(searchItems.length).toEqual(2);
		}));

		it("should not show a list of items if no recipes match", fakeAsync(() => {
			spyOn(searchesService, "recipesByName").and.callFake(() => of([]));
			fixture.detectChanges();
			selectElements();

			const input = component.form.controls["name"];
			input.setValue("sandwich");
			searchInput.nativeElement.dispatchEvent(new Event("input"));
			tick(1000);
			fixture.detectChanges();
			selectElements();

			expect(searchesService.recipesByName).toHaveBeenCalled();
			expect(searchItemsContainer).toBeFalsy();
			expect(searchItems.length).toBeFalsy();
		}));

		it("should navigate to the recipe route on form submission", () => {
			spyOn(router, "navigate");
			fixture.detectChanges();
			selectElements();

			const input = component.form.controls["name"];
			input.setValue("egg");
			searchInput.nativeElement.dispatchEvent(new Event("input"));
			fixture.detectChanges();
			selectElements();

			searchSubmitBtn.nativeElement.click();
			fixture.detectChanges();

			expect(router.navigate).toHaveBeenCalledWith(["/recipes", "egg"]);
		});

		it("should navigate to the recipe route on option click", fakeAsync(() => {
			spyOn(searchesService, "recipesByName").and.callFake(() =>
				of(testingObjects.searchBarTestingObjects)
			);
			spyOn(router, "navigate");
			fixture.detectChanges();
			selectElements();

			const input = component.form.controls["name"];
			input.setValue("egg");
			searchInput.nativeElement.dispatchEvent(new Event("input"));
			tick(1000);
			fixture.detectChanges();
			selectElements();

			searchItems[0].nativeElement.click();
			fixture.detectChanges();

			expect(router.navigate).toHaveBeenCalledWith(["/recipes", 1]);
		}));
	});

	describe("keyboard events", () => {
		beforeEach(fakeAsync(() => {
			spyOn(searchesService, "recipesByName").and.callFake(() =>
				of(testingObjects.searchBarTestingObjects)
			);
			fixture.detectChanges();
			selectElements();

			const input = component.form.controls["name"];
			input.setValue("egg");
			searchInput.nativeElement.dispatchEvent(new Event("input"));
			tick(1000);
			fixture.detectChanges();
			selectElements();
		}));

		it("should highlight the option on arrow down and set the value in the input", () => {
			const event = new KeyboardEvent("keydown", { key: "ArrowDown" });

			spyOn(component, "onArrowDown").and.callThrough();

			searchInput.nativeElement.dispatchEvent(event);
			fixture.detectChanges();
			selectElements();

			expect(component.onArrowDown).toHaveBeenCalled();
			expect(searchItems[0].classes["search--highlighted"]).toEqual(true);
			expect(searchInput.nativeElement.value).toEqual("Eggs");
		});

		it("should highlight the option on arrow up and set the value in the input", () => {
			const event = new KeyboardEvent("keydown", { key: "ArrowUp" });

			spyOn(component, "onArrowUp").and.callThrough();

			searchInput.nativeElement.dispatchEvent(event);
			fixture.detectChanges();
			selectElements();

			expect(component.onArrowUp).toHaveBeenCalled();
			expect(searchItems[1].classes["search--highlighted"]).toEqual(true);
			expect(searchInput.nativeElement.value).toEqual("Eggs and Rice");
		});

		it("should emit a completeSearch event on escape keydown", () => {
			const event = new KeyboardEvent("keydown", { key: "Escape" });

			spyOn(component, "onEscape").and.callThrough();
			spyOn(component.completeSearch, "emit");

			searchInput.nativeElement.dispatchEvent(event);
			fixture.detectChanges();
			selectElements();

			expect(component.onEscape).toHaveBeenCalled();
			expect(component.completeSearch.emit).toHaveBeenCalledWith(true);
		});
	});
});
