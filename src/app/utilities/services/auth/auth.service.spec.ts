import { TestBed } from "@angular/core/testing";

import { AuthService } from "./auth.service";
import {
	HttpClientTestingModule,
	HttpTestingController
} from "@angular/common/http/testing";
import { JwtModule, JwtHelperService } from "@auth0/angular-jwt";
import { UserTestingObjects } from "@testUtilities/user-testing-objects";

const userTestingObjects = new UserTestingObjects();

function tokenGetter() {
	return localStorage.getItem("authToken");
}

describe("AuthService", () => {
	let authService: AuthService;
	let http: HttpTestingController;
	let jwtHelper: JwtHelperService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
				JwtModule.forRoot({
					config: { tokenGetter }
				})
			],
			providers: [AuthService]
		});

		localStorage.removeItem("authToken");
		http = TestBed.get(HttpTestingController);
		authService = TestBed.get(AuthService);
		jwtHelper = TestBed.get(JwtHelperService);
	});

	afterAll(() => {
		localStorage.removeItem("authToken");
	});

	it("should be created", () => {
		expect(authService).toBeTruthy();
	});

	describe("checkUsernameAvailability", () => {
		it("should return a 204 status if a username is not already used", () => {
			const signupResponse = null;

			let response;
			authService.checkUsernameAvailability("myUser").subscribe(res => {
				response = res;
			});

			http
				.expectOne(
					"http://localhost:3000/user/available-username?username=myUser"
				)
				.flush(signupResponse, { status: 204, statusText: "No Content" });
			expect(response).toEqual(signupResponse);
			http.verify();
		});

		it("should return a 400 status if a username is already used", () => {
			const signupResponse = null;

			let errorResponse;
			authService.checkUsernameAvailability("myUser").subscribe(
				res => {},
				err => {
					errorResponse = err.error;
				}
			);

			http
				.expectOne(
					"http://localhost:3000/user/available-username?username=myUser"
				)
				.flush(signupResponse, { status: 400, statusText: "Bad Request" });
			expect(errorResponse).toEqual(signupResponse);
			http.verify();
		});
	});

	describe("signup", () => {
		it("should return a jwt and user", () => {
			const user = { ...userTestingObjects.userToSignin };
			const signupResponse = {
				jwt: "s3cr3tt0ken",
				user: { ...userTestingObjects.userObjectBeforeFormatter }
			};
			let response;

			authService.signup(user).subscribe(res => {
				response = res;
			});

			http.expectOne("http://localhost:3000/user/signup").flush(signupResponse);
			expect(response).toEqual(userTestingObjects.userObject);
			expect(localStorage.getItem("authToken")).toEqual("s3cr3tt0ken");
			http.verify();
		});

		it("should return an error when there is a server error", () => {
			const user = { ...userTestingObjects.userToSignin };
			const signupResponse = "There was an error signing up. Please try again.";
			let errorResponse;

			authService.signup(user).subscribe(
				res => {},
				err => {
					errorResponse = err;
				}
			);

			http
				.expectOne("http://localhost:3000/user/signup")
				.flush(
					{ message: signupResponse },
					{ status: 500, statusText: "Server Error" }
				);
			expect(errorResponse.error.message).toEqual(signupResponse);
			http.verify();
		});
	});

	describe("login", () => {
		it("should return a jwt and user", () => {
			const user = {
				email: "example@email.com",
				password: "password"
			};

			const loginResponse = {
				jwt: "s3cr3tt0ken",
				user: { ...userTestingObjects.userObjectBeforeFormatter }
			};
			let response;

			authService.login(user).subscribe(res => {
				response = res;
			});

			http.expectOne("http://localhost:3000/user/login").flush(loginResponse);
			expect(response).toEqual(userTestingObjects.userObject);
			expect(localStorage.getItem("authToken")).toEqual("s3cr3tt0ken");
			http.verify();
		});

		it("should return an error when the password does not match the email or the email does not exist in the database", () => {
			const user = {
				email: "example@email.com",
				password: "wrongPassword"
			};

			const loginResponse = "The login information was incorrect.";
			let errorResponse;

			authService.login(user).subscribe(
				res => {},
				err => {
					errorResponse = err;
				}
			);

			http
				.expectOne("http://localhost:3000/user/login")
				.flush(
					{ message: loginResponse },
					{ status: 400, statusText: "Bad Request" }
				);
			expect(errorResponse.error.message).toEqual(loginResponse);
			expect(localStorage.getItem("authToken")).toBeFalsy();
			http.verify();
		});
	});

	describe("isLoggedIn", () => {
		it("should return true if the user is logged in", () => {
			localStorage.setItem(
				"authToken",
				"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
					"eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ." +
					"SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
			);
			expect(authService.isLoggedIn()).toEqual(true);
		});

		it("should return false if the user is not logged in", () => {
			localStorage.removeItem("authToken");
			expect(authService.isLoggedIn()).toEqual(false);
		});
	});

	xdescribe("currentUser", () => {
		it("should return a user object with a valid token", () => {
			spyOn(localStorage, "getItem").and.callFake(() => "s3cr3tt0ken");
			spyOn(jwtHelper, "decodeToken").and.callFake(() => {
				return {
					exp: 1517847480,
					iat: 1517840280,
					username: "username",
					originalUsername: "username",
					isAdmin: true,
					id: 1
				};
			});
			const res = authService.currentUser();
			expect(localStorage.getItem).toHaveBeenCalled();
			expect(res.username).toBeDefined();
			expect(res.id).toBeDefined();
		});
	});

	describe("logout", () => {
		it("should clear the token from local storage", () => {
			localStorage.setItem("authToken", "s3cr3tt0ken");
			expect(localStorage.getItem("authToken")).toEqual("s3cr3tt0ken");
			authService.logout();
			expect(localStorage.getItem("authToken")).toBeFalsy();
		});
	});

	describe("updateUser", () => {
		it("should return a message when the user is updated", () => {
			const user = {
				firstName: "Joe"
			};
			const updateResponse = {
				message: "User successfully updated.",
				jwt: "s3cr3tt0ken",
				user: { ...userTestingObjects.userObjectBeforeFormatter }
			};

			let response;
			authService.updateUser(user).subscribe(res => {
				response = res;
			});
			http.expectOne("http://localhost:3000/user/update").flush(updateResponse);
			expect(response).toEqual({ ...userTestingObjects.userObject });
			http.verify();
			expect(localStorage.getItem("authToken")).toEqual("s3cr3tt0ken");
		});

		it("should return an error when email is already being used", () => {
			const user = {
				email: "example@email.com"
			};

			const updateResponse = "This email account is already in use.";
			let errorResponse;

			authService.updateUser(user).subscribe(
				res => {},
				err => {
					errorResponse = err;
				}
			);

			http
				.expectOne("http://localhost:3000/user/update")
				.flush(
					{ message: updateResponse },
					{ status: 400, statusText: "Bad Request" }
				);
			expect(errorResponse.error.message).toEqual(updateResponse);
			http.verify();
		});
	});

	describe("deleteUser", () => {
		it("should return a message when the user is deleted", () => {
			const signupResponse = {
				message: "User successfully deleted."
			};

			let response;
			authService.deleteUser().subscribe(res => {
				response = res;
			});

			http.expectOne("http://localhost:3000/user/delete").flush(signupResponse);
			expect(response).toEqual(signupResponse);
			http.verify();
		});

		it("should return an error on error", () => {
			const updateResponse = "There was an error deleting your profile.";
			let errorResponse;

			authService.deleteUser().subscribe(
				res => {},
				err => {
					errorResponse = err;
				}
			);

			http
				.expectOne("http://localhost:3000/user/delete")
				.flush(
					{ message: updateResponse },
					{ status: 500, statusText: "Server Error" }
				);
			expect(errorResponse.error.message).toEqual(updateResponse);
			http.verify();
		});
	});
});
