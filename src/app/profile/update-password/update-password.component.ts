import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// Forms
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// Font Awesome
import { faLock } from '@fortawesome/free-solid-svg-icons';
// Services
import { PasswordService } from '../../services/password/password.service';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  // Font Awesome
  faLock = faLock;
  // Form
  updatePasswordForm: FormGroup;
  sendingForm: boolean = false;
  submitted: boolean = false;
  formError: string;


  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private passwordService: PasswordService
  ) { }

  ngOnInit() {
    this.createForm();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  createForm() {
    this.updatePasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordConfirmation: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  // This gives the template easier access to the form
  get password() { return this.updatePasswordForm.get('password'); }
  get passwordConfirmation() { return this.updatePasswordForm.get('passwordConfirmation'); }

  onSubmit() {
    // This helps show errors on the form if a user tries to submit
    // the form before completing it
    this.submitted = true;

    // This stops the form submission if the form is invalid
    if (this.updatePasswordForm.invalid) {
      return;
    }

    // This stops the form submission if the passwords do not match
    if (this.updatePasswordForm.value.password !== this.updatePasswordForm.value.passwordConfirmation) {
      this.formError = 'Passwords must match.';
      return;
    }

    // This is to show a loading indicator
    this.sendingForm = true;

    const passwords = {
      password: this.updatePasswordForm.value.password,
      passwordConfirmation: this.updatePasswordForm.value.passwordConfirmation,
    }

    this.passwordService.updatePassword(passwords).pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe(res => {
      this.router.navigate(['/profile']);
    }, err => {
      // This stops the loading indicator
      this.sendingForm = false;
      // This shows the error message
      this.formError = err.error.message;
    });
  }

  clearErrorMessage() {
    this.formError = '';
  }
}
