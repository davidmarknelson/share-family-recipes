import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// Environment 
import { environment } from '../../../environments/environment';
// Interfaces
import { User } from './user';
// JWT
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, public jwtHelper: JwtHelperService) { }

  checkUsernameAvailability(username): Observable<any>  {
    return this.http.get(`${this.apiUrl}user/available-username`, { params: {
      username: username
    }});
  }

  signup(credentials, file): Observable<User> {
    let fd = new FormData();
    fd.append('firstName', credentials.firstName);
    fd.append('lastName', credentials.lastName);
    fd.append('username', credentials.username);
    fd.append('email', credentials.email);
    fd.append('password', credentials.password);
    fd.append('passwordConfirmation', credentials.passwordConfirmation);
    fd.append('adminCode', credentials.adminCode);
    if (file) fd.append('profilePic', file, credentials.profilePic);

    return this.http.post<User>(`${this.apiUrl}user/signup`, fd).pipe(
      map((res: User) => {
        localStorage.setItem('authToken', res.jwt);
        return res;
      })
    );
  }

  login(credentials): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}user/login`, credentials).pipe(
      map((res: User) => {
        localStorage.setItem('authToken', res.jwt);
        return res;
      })
    );
  }

  isLoggedIn() {
    return !this.jwtHelper.isTokenExpired();
  }
}
