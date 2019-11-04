import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, filter, debounceTime, mergeMap } from 'rxjs/operators';
import { Router } from '@angular/router';
// Forms
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// Services
import { AuthService } from '../../../utilities/services/auth/auth.service';
// Font Awesome
import { faUser, faEnvelope, faFileUpload, faChevronRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  editProfileForm: FormGroup;
  profilePicName: string = "example.jpeg";
  sendingForm: boolean = false;
  availableUsername: boolean;
  selectedFile: File;
  formError: string;
  emailTaken: boolean;
  takenUsername: boolean;
  // Font Awesome
  faFileUpload = faFileUpload;
  faEnvelope = faEnvelope;
  faUser = faUser;
  faChevronRight = faChevronRight;
  // Modal
  isModalOpen: boolean = false;
  isDeleting: boolean = false;

  constructor(
    private auth: AuthService, 
    private fb: FormBuilder, 
    private router: Router
  ) { }

  ngOnInit() {
    this.createForm();
    this.onUsernameChanges();
    this.onTakenEmailChanges();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  createForm() {
    this.editProfileForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: ['', Validators.email],
      username: ['', [Validators.minLength(5), Validators.maxLength(15), Validators.pattern('[^ ]*')]],
      profilePic: [null]
    });
  }

  // This gives the template easier access to the form
  get firstName() { return this.editProfileForm.get('firstName'); }
  get lastName() { return this.editProfileForm.get('lastName'); }
  get email() { return this.editProfileForm.get('email'); }
  get username() { return this.editProfileForm.get('username'); }

  // This adds the profile picture to a variable
  onFileSelected(event) {
    this.selectedFile = event.target.files[0];
    this.profilePicName = this.selectedFile.name;
  }

  // This checks for available usernames
  onUsernameChanges() {
    this.editProfileForm.get('username').valueChanges
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
    this.editProfileForm.get('email').valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        if (this.emailTaken) this.emailTaken = false;
      });
  }

  createUserObject() {
    let user = {};
    for (let key of Object.keys(this.editProfileForm.value)) {
      if (this.editProfileForm.value[key] && (key !== 'profilePic')) {
        user[key] = this.editProfileForm.value[key];
      }
    }
    return user;
  }

  onSubmit() {
    let user = this.createUserObject();

    // This stops the form submisson if the form is empty
    if (Object.getOwnPropertyNames(user).length === 0 && !this.selectedFile) {
      this.formError = 'You must enter information to change your profile.';
      return;
    }
    
    // This stops the form submission if the form is invalid
    if ((this.availableUsername === false) || (this.editProfileForm.status === 'INVALID')) return;

    // This is to show a loading indicator
    this.sendingForm = true;
    
    this.auth.updateUser(user, this.selectedFile).pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe(res => {
      this.router.navigate(['/profile']);
    }, err => {
      // These 2 if statements show errors on the related inputs.
      if (err.error.message === 'This email account is already in use.') this.emailTaken = true;
      if (err.error.message === 'This username is already taken.') this.availableUsername = false;

      // This stops the loading indicator
      this.sendingForm = false;
      // This shows the error message
      this.formError = err.error.message
    });
  }

  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
  }

  deleteUser() {
    this.isDeleting = true;
    this.auth.deleteUser().subscribe(res => {
      this.auth.logout();
      this.isDeleting = false;
      this.router.navigate(['/']);
    }, err => {
      this.isDeleting = false;
      this.isModalOpen = false;
      this.formError = err.error.message;
    });
  }

  clearErrorMessage() {
    this.formError = '';
  }
}
