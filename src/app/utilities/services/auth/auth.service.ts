import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
// Environment
import { environment } from "../../../../environments/environment";
// Interfaces
import { UserResponseObject } from "@interfaces/user-response-object";
import { UserProfile } from "@interfaces/user-profile";
import { UserLogin } from "@interfaces/user-login";
import { UserDecodedToken } from "@interfaces/user-decoded-token";
// JWT
import { JwtHelperService } from "@auth0/angular-jwt";
// Services
import { HelpersService } from "@services/helpers/helpers.service";

@Injectable({
	providedIn: "root"
})
export class AuthService {
	apiUrl = environment.apiUrl;

	constructor(
		private http: HttpClient,
		public jwtHelper: JwtHelperService,
		private helpers: HelpersService
	) {}

	checkUsernameAvailability(username): Observable<any> {
		return this.http.get(`${this.apiUrl}user/available-username`, {
			params: { username }
		});
	}

	signup(credentials): Observable<UserProfile> {
		return this.http
			.post<UserResponseObject>(`${this.apiUrl}user/signup`, credentials)
			.pipe(
				map(res => {
					localStorage.setItem("authToken", res.jwt);
					return res.user;
				}),
				map(user => {
					user.createdAt = this.helpers.formatDate(user.createdAt);
					user.updatedAt = this.helpers.formatDate(user.updatedAt);
					user.profilePic = this.helpers.formatProfilePic(user.profilePic);
					return user;
				})
			);
	}

	login(credentials: UserLogin): Observable<UserProfile> {
		return this.http
			.post<UserResponseObject>(`${this.apiUrl}user/login`, credentials)
			.pipe(
				map(res => {
					localStorage.setItem("authToken", res.jwt);
					return res.user;
				}),
				map(user => {
					user.createdAt = this.helpers.formatDate(user.createdAt);
					user.updatedAt = this.helpers.formatDate(user.updatedAt);
					user.profilePic = this.helpers.formatProfilePic(user.profilePic);
					return user;
				})
			);
	}

	getProfile$(): Observable<UserProfile> {
		return this.http.get<UserResponseObject>(`${this.apiUrl}user/profile`).pipe(
			map(res => {
				localStorage.setItem("authToken", res.jwt);
				return res.user;
			}),
			map(res => {
				res.createdAt = this.helpers.formatDate(res.createdAt);
				res.updatedAt = this.helpers.formatDate(res.updatedAt);
				res.profilePic = this.helpers.formatProfilePic(res.profilePic);
				return res;
			})
		);
	}

	updateUser(credentials): Observable<any> {
		return this.http.put<any>(`${this.apiUrl}user/update`, credentials);
	}

	deleteUser(): Observable<any> {
		return this.http.delete<any>(`${this.apiUrl}user/delete`);
	}

	isLoggedIn() {
		return !this.jwtHelper.isTokenExpired();
	}

	currentUser(): UserDecodedToken {
		return this.jwtHelper.decodeToken(localStorage.getItem("authToken"));
	}

	logout() {
		localStorage.removeItem("authToken");
	}
}
