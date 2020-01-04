import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// Environment 
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {
  cloudinaryUrl = `${environment.cloudinaryUrl}${environment.cloudName}/`;
  unsignedPreset = environment.unsignedPreset;

  constructor(private http: HttpClient) { }
  
  uploadPic(file, name): Observable<any> {
    let fd = new FormData();
    fd.append('file', file, name);
    fd.append('upload_preset', this.unsignedPreset);

    return this.http.post<any>(`${this.cloudinaryUrl}image/upload`, fd, {
      reportProgress: true,
      observe: 'events'
    })
  }

  // the delete token is only valid for 10 minutes
  // a successful delete will return { result: 'ok' }
  deleteImageByToken(deleteToken: string): Observable<any> {
    let fd = new FormData();
    fd.append('token', deleteToken);

    return this.http.post<any>(`https://api.cloudinary.com/v1_1/${environment.cloudName}/delete_by_token`, fd);
  }
}
