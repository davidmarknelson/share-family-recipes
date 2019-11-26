import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { format } from 'date-fns';
// Environment 
import { environment } from '../../../../environments/environment';
// Interfaces
import { JWT } from './jwt';
import { UserProfile } from './user-profile';
import { UserLogin } from './user-login';
import { UserDecodedToken } from './user-decoded-token';
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

    return this.http.post<JWT>(`${this.apiUrl}user/signup`, fd, { 
      headers: { 
        header: 'multipart/form-data'
      }}).pipe(
      map((res: JWT) => {
        localStorage.setItem('authToken', res.jwt);
        this.loggedIn.emit(true);
        return res;
      })
    );
  }

  login(credentials: UserLogin): Observable<JWT> {
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

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}user/profile`).pipe(
      map(res => {
        res.createdAt = this.formatDate(res.createdAt);
        res.updatedAt = this.formatDate(res.updatedAt);
        if (res.profilePic) {
          res.profilePic.profilePicName = `${environment.apiUrl}public/images/profilePics/${res.profilePic.profilePicName}`;
        } else {
          res.profilePic = {
            profilePicName: '../../../assets/images/default-img/default-profile-pic.jpg'
          };
        }
        return res;
      })
    );
  }

  formatDate(date) {
    return format(new Date(date), 'MMM dd, yyyy');
  }

  updateUser(credentials, file): Observable<any> {
    let fd = new FormData();
    for (let key of Object.keys(credentials)) {
      if (credentials[key] && (key !== 'profilePic')) {
        fd.append(key, credentials[key]);
      }
    }
    if (file) fd.append('profilePic', file, credentials.profilePic);

    return this.http.put<any>(`${this.apiUrl}user/update`, fd, { 
      headers: { 
        header: 'multipart/form-data'
      }
    });
  }

  deleteUser(): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}user/delete`);
  }

  isLoggedIn() {
    return !this.jwtHelper.isTokenExpired();
  }

  currentUser(): UserDecodedToken {
    return this.jwtHelper.decodeToken(localStorage.getItem('authToken'));
  }

  logout() {
    localStorage.removeItem('authToken');
    this.loggedIn.emit(false);
  }
}
