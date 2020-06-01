import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SearchBarComponent } from "./search-bar.component";
import { of } from "rxjs";
import { DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";
import { SearchesService } from "@services/searches/searches.service";
import { AppModule } from "../../app.module";
import { Router } from "@angular/router";

let fixture: ComponentFixture<SearchBarComponent>;
let searchContainer: DebugElement;
let searchInput: DebugElement;
let searchSubmitBtn: DebugElement;
let searchItemsContainer: DebugElement;
let searchItems;

function selectElements() {
	searchContainer = fixture.debugElement.query(By.css(".search__container"));
	searchInput = fixture.debugElement.query(By.css("#name"));
	searchSubmitBtn = fixture.debugElement.query(By.css("[type=submit]"));
	searchItemsContainer = fixture.debugElement.query(
		By.css(".search__items-container")
	);
	searchItems = fixture.debugElement.queryAll(By.css(".search__items"));
}

const user = {
	id: 1,
	isAdmin: true,
	username: "johndoe#1",
	iat: 1575496172,
	exp: 2180296172
};

const recipes = [
	{
		id: 1,
		name: "Eggs"
	},
	{
		id: 2,
		name: "Eggs and Rice"
	}
];

class MockRouter {
	navigate(path) {}
	navigateByUrl(path) {}
}

class MockAuthService {
	loggedIn = of();
	logout = jasmine.createSpy("logout");
	isLoggedIn() {}
	renewToken() {
		return of();
	}
	currentUser() {}
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
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
