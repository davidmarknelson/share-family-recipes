import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { toast } from 'bulma-toast';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/']);
      toast({
        message: 'You must be signed in to do that.',
        type: "is-danger",
        dismissible: true,
        duration: 5000,
        position: "top-center",
        closeOnClick: true,
        pauseOnHover: true
      });
      return false;
    }
  }
  
}
