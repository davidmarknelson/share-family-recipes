import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, filter, debounceTime, mergeMap } from 'rxjs/operators';
// Font Awesome
import { faLock, faUser, faEnvelope, faFileUpload, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
// Services
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  // Font Awesome
  // ============
  faFileUpload = faFileUpload;
  faEnvelope = faEnvelope;
  faLock = faLock;
  faUser = faUser;
  faCheck = faCheck;
  faTimes = faTimes;
  // Component
  // ============
  profilePicName: string = "example.jpeg";
  showAdminField: boolean = false;
  sendingForm: boolean = false;
  submitted: boolean = false;
  availableUsername: boolean;
  signupForm: FormGroup;
  selectedFile: File;
  formError: string;
  takenEmail: boolean;
  takenUsername: boolean;

  constructor(private fb: FormBuilder, private auth: AuthService) { }

  ngOnInit() {
    this.createForm();
    this.onUsernameChanges();
    this.onTakenEmailChanges();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  // This checks for available usernames
  onUsernameChanges() {
    this.signupForm.get('username').valueChanges
      .pipe(
        filter(val => val.length >= 5 && val.length <= 15),
        debounceTime(500),
        mergeMap(val => this.auth.checkUsernameAvailability(val)),
        takeUntil(this.ngUnsubscribe)
      ).subscribe(res => {
        this.availableUsername = true;
      }, err => {
        this.availableUsername = false;
        // The api returns a 400 error when the username is taken.
        // The resubscribes to the observable because subscriptions 
        // complete on errors.
        this.onUsernameChanges();
      });
  }

  // When there is an error saying that an email is already in use, the user will
  // change the email. After the user changes the email, this removes the error
  // message on the input.
  onTakenEmailChanges() {
    this.signupForm.get('email').valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        if (this.takenEmail) this.takenEmail = false;
      });
  }

  createForm() {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(15)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordConfirmation: ['', [Validators.required, Validators.minLength(8)]],
      profilePic: [null],
      adminCode: ['']
    });
  }

  // This gives the template easier access to the form
  get firstName() { return this.signupForm.get('firstName'); }
  get lastName() { return this.signupForm.get('lastName'); }
  get email() { return this.signupForm.get('email'); }
  get username() { return this.signupForm.get('username'); }
  get password() { return this.signupForm.get('password'); }
  get passwordConfirmation() { return this.signupForm.get('passwordConfirmation'); }

  // This adds the profile picture to a variable
  onFileSelected(event) {
    this.selectedFile = event.target.files[0];
    this.profilePicName = this.selectedFile.name;
    console.log(event.target.files[0])
  }

  onSubmit() {
    // This helps show errors on the form if a user tries to submit
    // the form before completing it
    this.submitted = true;

    // This stops the form submission if the form is invalid
    if (this.signupForm.invalid || !this.availableUsername) return;

    // This is to show a loading indicator
    this.sendingForm = true;

    const user = {
      firstName: this.signupForm.value.firstName,
      lastName: this.signupForm.value.lastName,
      email: this.signupForm.value.email,
      username: this.signupForm.value.username,
      password: this.signupForm.value.password,
      passwordConfirmation: this.signupForm.value.passwordConfirmation,
      profilePic: (this.signupForm.value.profilePic) ? this.signupForm.value.profilePic.replace("C:\\fakepath\\", "") : null,
      adminCode: this.signupForm.value.adminCode
    }

    this.auth.signup(user, this.selectedFile).subscribe(res => {
      this.takenEmail = false;
      this.sendingForm = false;
      this.formError = '';
    }, err => {
      // These 2 if statements show errors on the related inputs.
      if (err.error.message === 'This email account is already in use.') this.takenEmail = true;
      if (err.error.message === 'This username is already taken.') this.availableUsername = false;

      // This stops the loading indicator
      this.sendingForm = false;
      // This shows the error message
      this.formError = err.error.message
    });
  }

  toggleAdminField() {
    this.showAdminField = !this.showAdminField;
  }

  clearErrorMessage() {
    this.formError = '';
  }

}
