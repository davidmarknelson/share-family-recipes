import { Injectable } from "@angular/core";
import { UsersAdmin } from "../../interfaces/users-admin";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { format } from "date-fns";
// Environment
import { environment } from "../../../../environments/environment";

@Injectable({
	providedIn: "root",
})
export class AdminService {
	apiUrl = environment.apiUrl;

	constructor(private http: HttpClient) {}

	formatDate(date) {
		return format(new Date(date), "MMM dd, yyyy");
	}

	// =================================
	// Get users by signed up date
	// =================================
	getUsersByNewest(offset, limit): Observable<UsersAdmin> {
		return this.http
			.get<UsersAdmin>(`${this.apiUrl}admin/newusers`, {
				params: {
					offset: offset,
					limit: limit,
				},
			})
			.pipe(
				map(res => {
					for (let row of res.rows) {
						row.createdAt = this.formatDate(row.createdAt);
					}
					return res;
				})
			);
	}

	getUsersByOldest(offset, limit): Observable<UsersAdmin> {
		return this.http
			.get<UsersAdmin>(`${this.apiUrl}admin/oldusers`, {
				params: {
					offset: offset,
					limit: limit,
				},
			})
			.pipe(
				map(res => {
					for (let row of res.rows) {
						row.createdAt = this.formatDate(row.createdAt);
					}
					return res;
				})
			);
	}

	// =================================
	// Get users alphabetically by username
	// =================================
	getUsersByUsernameAtoZ(offset, limit): Observable<UsersAdmin> {
		return this.http
			.get<UsersAdmin>(`${this.apiUrl}admin/username-a-z`, {
				params: {
					offset: offset,
					limit: limit,
				},
			})
			.pipe(
				map(res => {
					for (let row of res.rows) {
						row.createdAt = this.formatDate(row.createdAt);
					}
					return res;
				})
			);
	}

	getUsersByUsernameZtoA(offset, limit): Observable<UsersAdmin> {
		return this.http
			.get<UsersAdmin>(`${this.apiUrl}admin/username-z-a`, {
				params: {
					offset: offset,
					limit: limit,
				},
			})
			.pipe(
				map(res => {
					for (let row of res.rows) {
						row.createdAt = this.formatDate(row.createdAt);
					}
					return res;
				})
			);
	}

	// =================================
	// Get users alphabetically by first name
	// =================================
	getUsersByFirstNameAtoZ(offset, limit): Observable<UsersAdmin> {
		return this.http
			.get<UsersAdmin>(`${this.apiUrl}admin/firstname-a-z`, {
				params: {
					offset: offset,
					limit: limit,
				},
			})
			.pipe(
				map(res => {
					for (let row of res.rows) {
						row.createdAt = this.formatDate(row.createdAt);
					}
					return res;
				})
			);
	}

	getUsersByFirstNameZtoA(offset, limit): Observable<UsersAdmin> {
		return this.http
			.get<UsersAdmin>(`${this.apiUrl}admin/firstname-z-a`, {
				params: {
					offset: offset,
					limit: limit,
				},
			})
			.pipe(
				map(res => {
					for (let row of res.rows) {
						row.createdAt = this.formatDate(row.createdAt);
					}
					return res;
				})
			);
	}

	// =================================
	// Get users alphabetically by last name
	// =================================
	getUsersByLastNameAtoZ(offset, limit): Observable<UsersAdmin> {
		return this.http
			.get<UsersAdmin>(`${this.apiUrl}admin/lastname-a-z`, {
				params: {
					offset: offset,
					limit: limit,
				},
			})
			.pipe(
				map(res => {
					for (let row of res.rows) {
						row.createdAt = this.formatDate(row.createdAt);
					}
					return res;
				})
			);
	}

	getUsersByLastNameZtoA(offset, limit): Observable<UsersAdmin> {
		return this.http
			.get<UsersAdmin>(`${this.apiUrl}admin/lastname-z-a`, {
				params: {
					offset: offset,
					limit: limit,
				},
			})
			.pipe(
				map(res => {
					for (let row of res.rows) {
						row.createdAt = this.formatDate(row.createdAt);
					}
					return res;
				})
			);
	}
}
