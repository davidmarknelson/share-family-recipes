import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// Environment 
import { environment } from '../../../environments/environment';
// Interfaces
import { JWT } from './jwt';
import { User } from './user';
// JWT
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl = environment.apiUrl;
  @Output() loggedIn: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private http: HttpClient, public jwtHelper: JwtHelperService) { }

  checkUsernameAvailability(username): Observable<any>  {
    return this.http.get(`${this.apiUrl}user/available-username`, { params: {
      username: username
    }});
  }

  signup(credentials, file): Observable<JWT> {
    let fd = new FormData();
    fd.append('firstName', credentials.firstName);
    fd.append('lastName', credentials.lastName);
    fd.append('username', credentials.username);
    fd.append('email', credentials.email);
    fd.append('password', credentials.password);
    fd.append('passwordConfirmation', credentials.passwordConfirmation);
    fd.append('adminCode', credentials.adminCode);
    if (file) fd.append('profilePic', file, credentials.profilePic);

    return this.http.post<JWT>(`${this.apiUrl}user/signup`, fd).pipe(
      map((res: JWT) => {
        localStorage.setItem('authToken', res.jwt);
        this.loggedIn.emit(true);
        return res;
      })
    );
  }

  login(credentials): Observable<JWT> {
    return this.http.post<JWT>(`${this.apiUrl}user/login`, credentials).pipe(
      map((res: JWT) => {
        localStorage.setItem('authToken', res.jwt);
        this.loggedIn.emit(true);
        return res;
      })
    );
  }

  renewToken(): Observable<JWT> {
    return this.http.get<JWT>(`${this.apiUrl}user/renew`).pipe(
      map((res: JWT) => {
        localStorage.setItem('authToken', res.jwt);
        return res;
      })
    );
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}user/profile`);
  }

  isLoggedIn() {
    return !this.jwtHelper.isTokenExpired();
  }

  currentUser() {
    return this.jwtHelper.decodeToken(localStorage.getItem('authToken'));
  }

  logout() {
    localStorage.removeItem('authToken');
    this.loggedIn.emit(false);
  }
}
