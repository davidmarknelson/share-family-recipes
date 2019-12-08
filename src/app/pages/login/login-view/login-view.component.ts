import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// Services and Interfaces
import { UserLogin } from '../../../utilities/services/auth/user-login';
import { AuthService } from '../../../utilities/services/auth/auth.service';
// Font Awesome
import { faLock, faEnvelope } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login-view',
  templateUrl: './login-view.component.html',
  styleUrls: ['./login-view.component.scss']
})
export class LoginViewComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  // Font Awesome
  faEnvelope = faEnvelope;
  faLock = faLock;
  // Form
  user: UserLogin = { email: '', password: '' };
  formError: string;
  sendingForm: boolean = false;

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
    
    // Shows loading spinner on the button
    this.sendingForm = true;

    this.auth.login(credentials).pipe(
      takeUntil(this.ngUnsubscribe)      
    ).subscribe(res => {
      this.router.navigate(['/profile']);
    }, err => {
      this.sendingForm = false;
      this.formError = err.error.message;
    });
  }

  clearErrorMessage() {
    this.formError = '';
  }

  navigateBack() {
    this.location.back();
  }
}
