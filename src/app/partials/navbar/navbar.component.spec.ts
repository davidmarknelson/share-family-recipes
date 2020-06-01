import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { NavbarComponent } from "./navbar.component";
import { By } from "@angular/platform-browser";
import { Observable } from "rxjs";
import { AppModule } from "../../app.module";
import { DebugElement } from "@angular/core";
import { RouterTestingModule } from "@angular/router/testing";
import { UserFacadeService } from "@facades/user-facade/user-facade.service";
import { UserTestingObjects } from "@testUtilities/user-testing-objects";

const userTestingObjs = new UserTestingObjects();

let fixture: ComponentFixture<NavbarComponent>;
let logoutBtn: DebugElement;
let loginBtn: DebugElement;
let signupBtn: DebugElement;
let navbarBrandBtn: DebugElement;
let createBtn: DebugElement;
let recipesBtn: DebugElement;
let searchBarBtn: DebugElement;
let yourRecipesLink: DebugElement;

function selectElements() {
	logoutBtn = fixture.debugElement.query(By.css("[data-test=navbar-logout]"));
	loginBtn = fixture.debugElement.query(By.css("[data-test=navbar-login]"));
	signupBtn = fixture.debugElement.query(By.css("[data-test=navbar-signup]"));
	navbarBrandBtn = fixture.debugElement.query(
		By.css("[data-test=navbar-brand]")
	);
	createBtn = fixture.debugElement.query(By.css("[data-test=navbar-create]"));
	recipesBtn = fixture.debugElement.query(By.css("[data-test=navbar-recipes]"));
	searchBarBtn = fixture.debugElement.query(By.css("[data-test=seachBarBtn]"));
	yourRecipesLink = fixture.debugElement.query(
		By.css("[data-test=navbar-your-recipes]")
	);
}

let userFromFacade;
let loggedInFromFacade;
class MockUserFacadeService {
	user$ = new Observable(observer => {
		observer.next(userFromFacade); // declared above to be assigned in tests
		observer.complete();
	});
	isLoggedIn$ = new Observable(observer => {
		observer.next(loggedInFromFacade); // declared above to be assigned in tests
		observer.complete();
	});
	logoutUser() {}
}

describe("NavbarComponent", () => {
	let component: NavbarComponent;
	let router: Router;
	let userFacade: UserFacadeService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [AppModule, RouterTestingModule]
		})
			.overrideComponent(NavbarComponent, {
				set: {
					providers: [
						{ provide: UserFacadeService, useClass: MockUserFacadeService }
					]
				}
			})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(NavbarComponent);
		component = fixture.componentInstance;
		router = fixture.debugElement.injector.get(Router);
		userFacade = fixture.debugElement.injector.get(UserFacadeService);
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	describe("with a user who is logged in", () => {
		beforeEach(() => {
			userFromFacade = { ...userTestingObjs.fullUserObject };
			loggedInFromFacade = true;
			fixture.detectChanges();
			selectElements();
		});

		it("should have a link to logout visible and not login and signup", () => {
			expect(logoutBtn).toBeTruthy();
			expect(loginBtn).toBeFalsy();
			expect(signupBtn).toBeFalsy();
		});

		it("should call user facade logout when logout is clicked", () => {
			spyOn(userFacade, "logoutUser");
			logoutBtn.nativeElement.click();
			fixture.detectChanges();
			expect(userFacade.logoutUser).toHaveBeenCalled();
		});

		it("should have the user name in the Your Recipes link", () => {
			expect(yourRecipesLink.properties.href).toEqual(
				"/recipes/user-recipes?username=jacksmith"
			);
		});
	});

	describe("with a user who is not logged in", () => {
		beforeEach(() => {
			userFromFacade = null;
			loggedInFromFacade = false;
			fixture.detectChanges();
			selectElements();
		});

		it("should have the correct link on different buttons", () => {
			expect(navbarBrandBtn.attributes.routerLink).toEqual("/");
			expect(recipesBtn.attributes.routerLink).toEqual("/recipes");
			expect(createBtn.attributes.routerLink).toEqual("/create");
			expect(loginBtn.attributes.routerLink).toEqual("/login");
			expect(signupBtn.attributes.routerLink).toEqual("/signup");
			expect(yourRecipesLink).toBeFalsy();
			expect(logoutBtn).toBeFalsy();
		});
	});

	describe("searchbar button", () => {
		it("should change isSearchOpen to true when clicked", () => {
			fixture.detectChanges();
			selectElements();

			searchBarBtn.nativeElement.click();
			fixture.detectChanges();

			expect(component.isSearchOpen).toEqual(true);
		});

		it("should change isSearchOpen to false when clicking the button when the value is true", () => {
			component.isSearchOpen = true;

			fixture.detectChanges();
			selectElements();

			searchBarBtn.nativeElement.click();
			fixture.detectChanges();

			expect(component.isSearchOpen).toEqual(false);
		});
	});
});
