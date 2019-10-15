import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Password } from './password';
// Environment 
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  updatePassword(credentials: Password): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}password/update`, credentials);
  }
}
