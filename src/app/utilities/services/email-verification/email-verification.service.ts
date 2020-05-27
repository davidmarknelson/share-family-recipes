import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
// Environment
import { environment } from "../../../../environments/environment";

@Injectable({
	providedIn: "root"
})
export class EmailVerificationService {
	apiUrl = environment.apiUrl;

	constructor(private http: HttpClient) {}

	sendVerificationEmail(email: string): Observable<any> {
		return this.http.post<any>(`${this.apiUrl}verify/send`, { email });
	}

	verifyEmail(token: string): Observable<any> {
		return this.http.post<any>(`${this.apiUrl}verify`, { token });
	}
}
