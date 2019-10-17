import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../../utilities/services/auth/auth.service';
import { toast } from 'bulma-toast';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    let user = this.authService.currentUser();
    if (user.isAdmin) {
      return true;
    } else {
      this.router.navigate(['/profile']);
      toast({
        message: 'You must be an admin to view that page.',
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
