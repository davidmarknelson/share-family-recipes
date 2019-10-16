import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// Font Awesome
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
// Services
import { PasswordService } from '../../services/password/password.service';
import { ResetEmail } from '../../services/password/reset-email';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  // Font Awesome
  faEnvelope = faEnvelope;
  // Form
  email: ResetEmail = { email: '' };
  formError: string;
  sendingEmail: boolean = false;
  emailSuccess: boolean = false;

  constructor(private passwordService: PasswordService) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  sendEmail(email: ResetEmail) {
    if (!email.email) {
      return this.formError = 'Email is required.';
    }

    // Clears the error message
    this.formError = '';

    // Shows loading spinner on the button
    this.sendingEmail = true;

    this.passwordService.sendResetEmail(email).pipe(
      takeUntil(this.ngUnsubscribe)      
    ).subscribe(res => {
      this.sendingEmail = false;
      this.email.email = '';
      this.emailSuccess = true;
    }, err => {
      this.sendingEmail = false;
      this.formError = err.error.message;
    });
  }

  clearErrorMessage() {
    this.formError = '';
    this.emailSuccess = false;
  }
}
