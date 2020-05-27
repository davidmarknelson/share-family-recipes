import { Injectable, Output, EventEmitter } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { format } from "date-fns";
// Environment
import { environment } from "../../../../environments/environment";
// Interfaces
import { JWT } from "../../interfaces/jwt";
import { UserProfile } from "../../interfaces/user-profile";
import { UserLogin } from "../../interfaces/user-login";
import { UserDecodedToken } from "../../interfaces/user-decoded-token";
// JWT
import { JwtHelperService } from "@auth0/angular-jwt";
// Services
import { HelpersService } from "@services/helpers/helpers.service";

@Injectable({
	providedIn: "root"
})
export class AuthService {
	apiUrl = environment.apiUrl;
	@Output() loggedIn: EventEmitter<boolean> = new EventEmitter<boolean>();

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

	signup(credentials): Observable<JWT> {
		return this.http.post<JWT>(`${this.apiUrl}user/signup`, credentials).pipe(
			map((res: JWT) => {
				localStorage.setItem("authToken", res.jwt);
				this.loggedIn.emit(true);
				return res;
			})
		);
	}

	login(credentials: UserLogin): Observable<JWT> {
		return this.http.post<JWT>(`${this.apiUrl}user/login`, credentials).pipe(
			map((res: JWT) => {
				localStorage.setItem("authToken", res.jwt);
				this.loggedIn.emit(true);
				return res;
			})
		);
	}

	renewToken(): Observable<JWT> {
		return this.http.get<JWT>(`${this.apiUrl}user/renew`).pipe(
			map((res: JWT) => {
				localStorage.setItem("authToken", res.jwt);
				return res;
			})
		);
	}

	// TODO remove getProfile and move helper functions to helper service
	getProfile(): Observable<UserProfile> {
		return this.http.get<any>(`${this.apiUrl}user/profile`).pipe(
			map(res => {
				res.createdAt = this.helpers.formatDate(res.createdAt);
				res.updatedAt = this.helpers.formatDate(res.updatedAt);
				res.profilePic = this.helpers.formatProfilePic(res.profilePic);
				return res;
			})
		);
	}

	getProfile$(): Observable<UserProfile> {
		return this.http.get<any>(`${this.apiUrl}user/profile`).pipe(
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
		this.loggedIn.emit(false);
	}
}
