import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { toast } from 'bulma-toast';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor  {

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('authToken');

    // This keeps the auth token out of the header when uploading
    // pictures to cloudinary for signed in users
    if (token && !req.url.startsWith('https://api.cloudinary.com/')) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          if (event.body && event.body.message) {
            toast({
              message: event.body.message,
              type: "is-success",
              dismissible: true,
              duration: 5000,
              position: "top-center",
              closeOnClick: true,
              pauseOnHover: true
            });
          }
        }
      })
    );
  }
}
