import { Injectable } from "@angular/core";
import {
	HttpEvent,
	HttpInterceptor,
	HttpHandler,
	HttpRequest,
	HttpResponse
} from "@angular/common/http";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { ToastService } from "@services/toast/toast.service";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
	constructor(private toast: ToastService) {}

	intercept(
		req: HttpRequest<any>,
		next: HttpHandler
	): Observable<HttpEvent<any>> {
		const token = localStorage.getItem("authToken");

		// This keeps the auth token out of the header when uploading
		// pictures to cloudinary for signed in users
		if (token && !req.url.startsWith("https://api.cloudinary.com/")) {
			req = req.clone({
				setHeaders: {
					Authorization: `Bearer ${token}`,
          'Access-Control-Allow-Origin': '*'
				}
			});
		}

		return next.handle(req).pipe(
			tap(event => {
				if (event instanceof HttpResponse) {
					if (event.body && event.body.message) {
						this.toast.successToast(event.body.message);
					}
				}
			})
		);
	}
}
