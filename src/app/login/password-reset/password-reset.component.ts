import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// Forms
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// Font Awesome
import { faLock } from '@fortawesome/free-solid-svg-icons';
// Services
import { PasswordService } from '../../services/password/password.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  // Font Awesome
  faLock = faLock;
  // Form
  resetPasswordForm: FormGroup;
  sendingForm: boolean = false;
  submitted: boolean = false;
  formError: string;
  // Reset token
  resetToken: string;

  constructor(
    private route: ActivatedRoute, 
    private fb: FormBuilder, 
    private router: Router,
    private passwordService: PasswordService
  ) { }

  ngOnInit() {
    this.createForm();
    this.resetToken = this.route.snapshot.queryParams['token'];
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  createForm() {
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordConfirmation: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  // This gives the template easier access to the form
  get password() { return this.resetPasswordForm.get('password'); }
  get passwordConfirmation() { return this.resetPasswordForm.get('passwordConfirmation'); }

  onSubmit() {
    // This helps show errors on the form if a user tries to submit
    // the form before completing it
    this.submitted = true;

    // This stops the form submission if the form is invalid
    if (this.resetPasswordForm.invalid) {
      return;
    }

    // This stops the form submission if the passwords do not match
    if (this.resetPasswordForm.value.password !== this.resetPasswordForm.value.passwordConfirmation) {
      return this.formError = 'Passwords must match.';
    }

    // This is to show a loading indicator
    this.sendingForm = true;

    const credentials = {
      password: this.resetPasswordForm.value.password,
      passwordConfirmation: this.resetPasswordForm.value.passwordConfirmation,
      token: this.resetToken
    }

    this.passwordService.resetPassword(credentials).pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe(res => {
      this.router.navigate(['/login']);
    }, err => {
      // This stops the loading indicator
      this.sendingForm = false;

      // This reroutes the user to the forgotpassword page to resent a reset email.
      if (err.error.message === 'Password reset token is invalid or has expired. Resend reset email.') {
        return this.router.navigate(['/login/forgotpassword']);
      }
      // This shows the error message
      this.formError = err.error.message;
    });
  }

  clearErrorMessage() {
    this.formError = '';
  }
}
