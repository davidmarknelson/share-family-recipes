import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ProfileViewComponent } from "./profile-view.component";
import { Observable } from "rxjs";
import { By } from "@angular/platform-browser";
import { ProfileModule } from "@pages/profile/profile.module";
import { RouterTestingModule } from "@angular/router/testing";
import { UserFacadeService } from "@facades/user-facade/user-facade.service";
import { DebugElement } from "@angular/core";
import { UserTestingObjects } from "@testUtilities/user-testing-objects";
import { HttpClientModule } from "@angular/common/http";

const userTestingObjects = new UserTestingObjects();

let fixture: ComponentFixture<ProfileViewComponent>;
let username: DebugElement;
let name: DebugElement;
let email: DebugElement;
let date: DebugElement;
let profilePic: DebugElement;
let adminBtn: DebugElement;
let emailVerifyMsg: DebugElement;
let yourRecipesBtn: DebugElement;

function selectElements() {
	username = fixture.debugElement.query(By.css("[data-test=username]"));
	name = fixture.debugElement.query(By.css("[data-test=name]"));
	email = fixture.debugElement.query(By.css("[data-test=email]"));
	date = fixture.debugElement.query(By.css("[data-test=date]"));
	profilePic = fixture.debugElement.query(By.css("[data-test=profilePic]"));
	adminBtn = fixture.debugElement.query(By.css("[data-test=adminLink]"));
	emailVerifyMsg = fixture.debugElement.query(
		By.css("[data-test=emailVerifyMsg]")
	);
	yourRecipesBtn = fixture.debugElement.query(
		By.css("[data-test=yourRecipes]")
	);
}

let user;
class MockUserFacade {
	user$ = new Observable(observer => {
		observer.next(user); // declared above to be assigned in tests
		observer.complete();
	});
}

describe("ProfileComponent", () => {
	let component: ProfileViewComponent;
	let userFacade: UserFacadeService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [ProfileModule, RouterTestingModule, HttpClientModule]
		})
			.overrideComponent(ProfileViewComponent, {
				set: {
					providers: [{ provide: UserFacadeService, useClass: MockUserFacade }]
				}
			})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ProfileViewComponent);
		component = fixture.componentInstance;
		userFacade = fixture.debugElement.injector.get(UserFacadeService);
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	describe("profile with out profilePic, not an admin, and not verified", () => {
		beforeEach(() => {
			user = { ...userTestingObjects.userObject };
			fixture.detectChanges();
			selectElements();
		});

		it("should populate the page with the user info", () => {
			expect(username).toBeTruthy();
			expect(name).toBeTruthy();
			expect(email).toBeTruthy();
			expect(date).toBeTruthy();
			expect(profilePic).toBeTruthy();
			expect(profilePic.properties.src).toEqual(
				"assets/images/default-img/default-profile-pic.jpg"
			);
			expect(adminBtn).toBeFalsy();
			expect(emailVerifyMsg).toBeTruthy();
		});

		it("should have a link to the recipes page for the user", () => {
			expect(yourRecipesBtn.properties.href).toEqual(
				"/recipes/user-recipes?username=johndoe"
			);
		});
	});

	describe("profile with a profilePic, an admin, and verified", () => {
		beforeEach(() => {
			user = { ...userTestingObjects.fullUserObject };
			fixture.detectChanges();
			selectElements();
		});

		it("should populate the page with the user info", () => {
			expect(profilePic.properties.src).toEqual("www.awesomepic.com");
			expect(username).toBeTruthy();
			expect(name).toBeTruthy();
			expect(email).toBeTruthy();
			expect(date).toBeTruthy();
			expect(profilePic).toBeTruthy();
			expect(adminBtn).toBeTruthy();
			expect(emailVerifyMsg).toBeFalsy();
		});

		it("should have a link to the recipes page for the user", () => {
			expect(yourRecipesBtn.properties.href).toEqual(
				"/recipes/user-recipes?username=jacksmith"
			);
		});
	});
});
