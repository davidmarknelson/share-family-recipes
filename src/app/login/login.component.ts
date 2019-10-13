import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// Services and Interfaces
import { UserLogin } from '../services/auth/user-login';
import { AuthService } from '../services/auth/auth.service';
// Font Awesome
import { faLock, faEnvelope } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  // Font Awesome
  faEnvelope = faEnvelope;
  faLock = faLock;
  // Form
  user: UserLogin = { email: '', password: '' };
  formError: string;

  constructor(private auth: AuthService, private router: Router, private location: Location) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  login(credentials: UserLogin) {
    if (!credentials.email || !credentials.password) {
      return this.formError = 'Email and password are required.';
    }
    
    this.auth.login(credentials).pipe(
      takeUntil(this.ngUnsubscribe)      
    ).subscribe(res => {
      this.router.navigate(['/profile']);
    }, err => this.formError = err.error.message);
  }

  clearErrorMessage() {
    this.formError = '';
  }

  navigateBack() {
    this.location.back();
  }
}
