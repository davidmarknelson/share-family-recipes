import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// Environment 
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LikesService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  addLike(recipeId): Observable<any>  {
    return this.http.post<any>(`${this.apiUrl}likes/add`, { recipeId: recipeId});
  }

  removeLike(recipeId): Observable<any>  {
    return this.http.request<any>('delete', `${this.apiUrl}likes/remove`, { body: { recipeId: recipeId}});
  }
}
