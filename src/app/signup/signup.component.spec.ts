import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { SignupModule } from './signup.module';
import { SignupComponent } from './signup.component';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { Location } from '@angular/common';

let fixture: ComponentFixture<SignupComponent>;
let firstName: DebugElement;
let lastName: DebugElement;
let email: DebugElement;
let username: DebugElement;
let password: DebugElement;
let passwordConfirmation: DebugElement;
let adminLink: DebugElement;
let adminCode: DebugElement;
let submitButton: DebugElement;

function selectElements() {
  firstName = fixture.debugElement.query(By.css('[data-test=firstName]'));
  lastName = fixture.debugElement.query(By.css('[data-test=lastName]'));
  email = fixture.debugElement.query(By.css('[data-test=email]'));
  username = fixture.debugElement.query(By.css('[data-test=username]'));
  password = fixture.debugElement.query(By.css('[data-test=password]'));
  passwordConfirmation = fixture.debugElement.query(By.css('[data-test=passwordConfirmation]'));
  adminLink = fixture.debugElement.query(By.css('[data-test=adminLink]'));
  adminCode = fixture.debugElement.query(By.css('[data-test=adminCode]'));
  submitButton = fixture.debugElement.query(By.css('[data-test=submit-button]'));
}

class MockAuthService {
  signup(credentials, profilePic) {}
  checkUsernameAvailability(username) {}
}

class MockRouter {
  navigate(path) {}
}

class MockLocation {
  back() {}
}

describe('SignupComponent', () => {
  let component: SignupComponent;
  let authService: AuthService;
  let router: Router;
  let location: Location;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SignupModule],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .overrideComponent(SignupComponent, {
      set: {
        providers: [
          { provide: AuthService, useClass: MockAuthService },
          { provide: Router, useClass: MockRouter },
          { provide: Location, useClass: MockLocation }
        ]
      }
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    authService = fixture.debugElement.injector.get(AuthService);
    router = fixture.debugElement.injector.get(Router);
    fixture.detectChanges();
    selectElements();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('signup form', () => {
    it('should be invalid when empty', () => {
      expect(component.signupForm.valid).toBeFalsy();
    });

    describe('first name input', () => {
      it('should be invalid when empty', () => {
        let input = component.signupForm.controls['firstName'];

        expect(input.errors['required']).toBeTruthy();
      });

      it('should be vaild with a name and have the class is-success', () => {
        let input = component.signupForm.controls['firstName'];
        
        input.setValue("John");
        firstName.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(input.errors).toBeFalsy();
        expect(input.valid).toBeTruthy();
        expect(firstName.classes['is-success']).toBeTruthy();
      });

      it('should show an error if it has been touched, but empty', () => {
        let input = component.signupForm.controls['firstName'];

        input.setValue("");
        firstName.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        let firstNameRequired = fixture.debugElement.query(By.css('[data-test=firstNameRequired]'));
        expect(input.errors['required']).toBeTruthy();
        expect(firstName.classes['is-danger']).toBeTruthy();
        expect(firstNameRequired).toBeTruthy();
      });
    });

    describe('last name input', () => {
      it('should be invalid when empty', () => {
        let input = component.signupForm.controls['lastName'];
        expect(input.errors['required']).toBeTruthy();
      });

      it('should be vaild with a name and have the class is-success', () => {
        let input = component.signupForm.controls['lastName'];
        
        input.setValue("Doe");
        lastName.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(input.errors).toBeFalsy();
        expect(input.valid).toBeTruthy();
        expect(lastName.classes['is-success']).toBeTruthy();
      });

      it('should show an error if it has been touched, but empty', () => {
        let input = component.signupForm.controls['lastName'];
        
        input.setValue("");
        lastName.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        let lastNameRequired = fixture.debugElement.query(By.css('[data-test=lastNameRequired]'));
        expect(input.errors['required']).toBeTruthy();
        expect(lastName.classes['is-danger']).toBeTruthy();
        expect(lastNameRequired).toBeTruthy();
      });
    });

    describe('username', () => {
      it('should be invalid when empty', () => {
        let input = component.signupForm.controls['username'];
        expect(input.errors['required']).toBeTruthy();
      });

      it('should show an error when the input is touched but empty', () => {
        let input = component.signupForm.controls['username'];
  
        input.setValue("");
        username.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        let usernameRequired = fixture.debugElement.query(By.css('[data-test=usernameRequired]'));
        expect(input.errors['required']).toBeTruthy();
        expect(username.classes['is-danger']).toBeTruthy();
        expect(usernameRequired).toBeTruthy();
      });

      it('should show an error if the username is too short', () => {
        let input = component.signupForm.controls['username'];
  
        input.setValue('user');
        username.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        let usernameMinLength = fixture.debugElement.query(By.css('[data-test=usernameMinLength]'));
        expect(input.errors['minlength']).toBeTruthy();
        expect(username.classes['is-danger']).toBeTruthy();
        expect(usernameMinLength).toBeTruthy();
      });

      it('should show an error if the username is too long', () => {
        let input = component.signupForm.controls['username'];
  
        input.setValue('UsernameThatIsWayTooLong');
        username.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        let usernameMaxLength = fixture.debugElement.query(By.css('[data-test=usernameMaxLength]'));
        expect(input.errors['maxlength']).toBeTruthy();
        expect(username.classes['is-danger']).toBeTruthy();
        expect(usernameMaxLength).toBeTruthy();
      });

      it('should show an error if the username contains a space', () => {
        let input = component.signupForm.controls['username'];
  
        input.setValue('my User');
        username.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        let usernamePattern = fixture.debugElement.query(By.css('[data-test=usernamePattern]'));
        expect(input.errors['pattern']).toBeTruthy();
        expect(username.classes['is-danger']).toBeTruthy();
        expect(usernamePattern).toBeTruthy();
      });

      it('should show a success message if the username is available', fakeAsync(() => {
        let input = component.signupForm.controls['username'];

        spyOn(authService, 'checkUsernameAvailability').and.callFake(() => {
          component.availableUsername = true;
          return of();
        });


        input.setValue('myUser');
        username.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        // This is used because the function has a 500ms wait time
        tick(1000);
        fixture.detectChanges();
        expect(authService.checkUsernameAvailability).toHaveBeenCalledWith('myUser');
        expect(input.errors).toBeFalsy();
        let availableUsername = fixture.debugElement.query(By.css('[data-test=usernameAvailable]'));
        expect(username.classes['is-success']).toBeTruthy();
        expect(availableUsername).toBeTruthy();
      }));

      it('should show an error if the username is taken', fakeAsync(() => {
        let input = component.signupForm.controls['username'];

        spyOn(authService, 'checkUsernameAvailability').and.callFake(() => {
          component.availableUsername = false;
          return throwError({});
        });

        input.setValue('myUser');
        username.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        // This is used because the function has a 500ms wait time
        tick(1000);
        fixture.detectChanges();
        expect(authService.checkUsernameAvailability).toHaveBeenCalledWith('myUser');
        expect(input.errors).toBeFalsy();
        let unavailableUsername = fixture.debugElement.query(By.css('[data-test=usernameUnavailable]'));
        expect(username.classes['is-danger']).toBeTruthy();
        expect(unavailableUsername).toBeTruthy();
      }));
    });

    describe('email', () => {
      it('should be invalid when empty', () => {
        let input = component.signupForm.controls['email'];

        expect(input.errors['required']).toBeTruthy();
      });

      it('should highlight the input with green when the text is an email', () => {
        let input = component.signupForm.controls['email'];
  
        // valid 1
        input.setValue("example@email.com");
        email.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(input.errors).toBeFalsy();
        expect(input.valid).toBeTruthy();
        expect(email.classes['is-success']).toBeTruthy();

        // valid 2
        input.setValue("example@email");
        email.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(input.errors).toBeFalsy();
        expect(input.valid).toBeTruthy();
        expect(email.classes['is-success']).toBeTruthy();
      });

      it('should show an error when the input is touched and empty', () => {
        let input = component.signupForm.controls['email'];
  
        input.setValue('');
        email.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        let emailRequired = fixture.debugElement.query(By.css('[data-test=emailRequired]'));
        expect(input.errors['required']).toBeTruthy();
        expect(email.classes['is-danger']).toBeTruthy();
        expect(emailRequired).toBeTruthy();
      });

      it('should show an error when the text is not an email', () => {
        let input = component.signupForm.controls['email'];
  
        // Not an email 1
        input.setValue("example");
        email.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        let notEmail = fixture.debugElement.query(By.css('[data-test=notEmail]'));
        expect(input.errors['email']).toBeTruthy();
        expect(email.classes['is-danger']).toBeTruthy();
        expect(notEmail).toBeTruthy();
  
        // Not an email 2
        input.setValue("example@");
        email.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(input.errors['email']).toBeTruthy();
        expect(email.classes['is-danger']).toBeTruthy();
        expect(notEmail).toBeTruthy();
  
        // Not an email 3
        input.setValue("example@email.");
        email.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(input.errors['email']).toBeTruthy();
        expect(email.classes['is-danger']).toBeTruthy();
        expect(notEmail).toBeTruthy();
      });
    });

    describe('password inputs', () => {
      it('should be invalid when empty', () => {
        let input = component.signupForm.controls['password'];
        let input2 = component.signupForm.controls['passwordConfirmation'];

        expect(input.errors['required']).toBeTruthy();
        expect(input2.errors['required']).toBeTruthy();
      });

      it('should show an error when the field is empty and touched', () => {
        let input = component.signupForm.controls['password'];
        let input2 = component.signupForm.controls['passwordConfirmation'];

        input.setValue('');
        password.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        let passwordRequired = fixture.debugElement.query(By.css('[data-test=passwordRequired]'));
        expect(input.errors['required']).toBeTruthy();
        expect(password.classes['is-danger']).toBeTruthy();
        expect(passwordRequired).toBeTruthy();

        // PW confirmation
        input2.setValue('');
        passwordConfirmation.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        let passwordConfirmationRequired = fixture.debugElement.query(By.css('[data-test=passwordConfirmationRequired]'));
        expect(input2.errors['required']).toBeTruthy();
        expect(passwordConfirmation.classes['is-danger']).toBeTruthy();
        expect(passwordConfirmationRequired).toBeTruthy();
      });

      it('should show an error when the password is too short', () => {
        let input = component.signupForm.controls['password'];
        let input2 = component.signupForm.controls['passwordConfirmation'];

        input.setValue('pass');
        password.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        let passwordLength = fixture.debugElement.query(By.css('[data-test=passwordLength]'));
        expect(input.errors['minlength']).toBeTruthy();
        expect(password.classes['is-danger']).toBeTruthy();
        expect(passwordLength).toBeTruthy();

        // PW confirmation
        input2.setValue('pass');
        passwordConfirmation.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        let passwordConfirmationLength = fixture.debugElement.query(By.css('[data-test=passwordConfirmationLength]'));
        expect(input2.errors['minlength']).toBeTruthy();
        expect(passwordConfirmation.classes['is-danger']).toBeTruthy();
        expect(passwordConfirmationLength).toBeTruthy();
      });

      it('should not highlight the input green when the passwords do not match', () => {
        let input = component.signupForm.controls['password'];
        let input2 = component.signupForm.controls['passwordConfirmation'];

        input.setValue('password');
        password.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(password.classes['is-danger']).toBeFalsy();
        expect(password.classes['is-success']).toBeFalsy();
        // PW confirmation
        input2.setValue('PASSWORD');
        passwordConfirmation.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        let passwordMatch = fixture.debugElement.query(By.css('[data-test=passwordMatch]'));
        expect(passwordConfirmation.classes['is-danger']).toBeFalsy();
        expect(passwordConfirmation.classes['is-success']).toBeFalsy();
        expect(passwordMatch).toBeFalsy();
      });

      it('should show a success message when the passwords match', () => {
        let input = component.signupForm.controls['password'];
        let input2 = component.signupForm.controls['passwordConfirmation'];
  
        input.setValue('password');
        password.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        input2.setValue('password');
        passwordConfirmation.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        let passwordMatch = fixture.debugElement.query(By.css('[data-test=passwordMatch]'));
        expect(password.classes['is-danger']).toBeFalsy();
        expect(password.classes['is-success']).toBeTruthy();
        expect(passwordConfirmation.classes['is-danger']).toBeFalsy();
        expect(passwordConfirmation.classes['is-success']).toBeTruthy();
        expect(password.classes['is-success']).toBeTruthy();
        expect(passwordMatch).toBeTruthy();
      });
    });

    describe('admin code', () => {
      it('should initialize with the link showing and not the input', () => {
        expect(adminLink).toBeTruthy();
        expect(adminCode).toBeFalsy();
      });

      it('should show the input when clicking on the link', () => {
        adminLink.nativeElement.click();
        fixture.detectChanges();
        // Gets the elements after the change detection because the values have changed
        adminLink = fixture.debugElement.query(By.css('[data-test=adminLink]'));
        adminCode = fixture.debugElement.query(By.css('[data-test=adminCode]'));
        expect(adminLink).toBeFalsy();
        expect(adminCode).toBeTruthy();
      });
    });

    describe('submit', () => {
      it('should show requirements when user tries to submit without entering information', () => {
        let form = component.signupForm.controls;

        submitButton.nativeElement.click();
        fixture.detectChanges();

        spyOn(authService, 'signup');
        expect(authService.signup).not.toHaveBeenCalled();

        expect(form.firstName.errors['required']).toBeTruthy();
        expect(form.lastName.errors['required']).toBeTruthy();
        expect(form.username.errors['required']).toBeTruthy();
        expect(form.email.errors['required']).toBeTruthy();
        expect(form.password.errors['required']).toBeTruthy();
        expect(form.passwordConfirmation.errors['required']).toBeTruthy();

        // fire events
        firstName.nativeElement.dispatchEvent(new Event('input'));
        lastName.nativeElement.dispatchEvent(new Event('input'));
        username.nativeElement.dispatchEvent(new Event('input'));
        email.nativeElement.dispatchEvent(new Event('input'));
        password.nativeElement.dispatchEvent(new Event('input'));
        passwordConfirmation.nativeElement.dispatchEvent(new Event('input'));

        fixture.detectChanges();

        // select required messages
        let firstNameRequired = fixture.debugElement.query(By.css('[data-test=firstNameRequired]'));
        let lastNameRequired = fixture.debugElement.query(By.css('[data-test=lastNameRequired]'));
        let usernameRequired = fixture.debugElement.query(By.css('[data-test=usernameRequired]'));
        let emailRequired = fixture.debugElement.query(By.css('[data-test=emailRequired]'));
        let passwordRequired = fixture.debugElement.query(By.css('[data-test=passwordRequired]'));
        let passwordConfirmationRequired = fixture.debugElement.query(By.css('[data-test=passwordConfirmationRequired]'));

        // show error message expectations
        expect(firstNameRequired).toBeTruthy();
        expect(lastNameRequired).toBeTruthy();
        expect(usernameRequired).toBeTruthy();
        expect(emailRequired).toBeTruthy();
        expect(passwordRequired).toBeTruthy();
        expect(passwordConfirmationRequired).toBeTruthy();

        // show input class expectations
        expect(firstName.classes['is-danger']).toBeTruthy();
        expect(lastName.classes['is-danger']).toBeTruthy();
        expect(username.classes['is-danger']).toBeTruthy();
        expect(email.classes['is-danger']).toBeTruthy();
        expect(password.classes['is-danger']).toBeTruthy();
        expect(passwordConfirmation.classes['is-danger']).toBeTruthy();
      });

      it('should submit with valid credentials', () => {
        let form = component.signupForm.controls;

        spyOn(authService, 'signup').and.callFake(() => {
          return of({ jwt: 's3cr3tt0ken' });
        });
        spyOn(router, 'navigate');

        // set form values
        form.firstName.setValue('John');
        form.lastName.setValue('Doe');
        form.username.setValue('myUser');
        form.email.setValue('example@email.com');
        form.password.setValue('password');
        form.passwordConfirmation.setValue('password');

        // this makes the username input valid
        // this was already tested in the username testing suite 
        // so we will just change the value this way
        component.availableUsername = true;
        
        // check that there should not be any errors
        expect(component.signupForm.errors).toBeFalsy();
        
        submitButton.nativeElement.click();
        fixture.detectChanges();
        expect(authService.signup).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith(['/profile']);
      });

      it('should return an error if the email is taken and change the email input class', () => {
        let form = component.signupForm.controls;

        spyOn(authService, 'signup').and.callFake(() => {
          return throwError({
            error: {
              message: 'This email account is already in use.'
            } 
          });
        });
        spyOn(router, 'navigate');

        // set form values
        form.firstName.setValue('John');
        form.lastName.setValue('Doe');
        form.username.setValue('myUser');
        form.email.setValue('example@email.com');
        form.password.setValue('password');
        form.passwordConfirmation.setValue('password');

        // this makes the username input valid
        // this was already tested in the username testing suite 
        // so we will just change the value this way
        component.availableUsername = true;
        
        // check that there should not be any errors
        expect(component.signupForm.errors).toBeFalsy();
        
        submitButton.nativeElement.click();
        fixture.detectChanges();
        expect(authService.signup).toHaveBeenCalled();
        expect(router.navigate).not.toHaveBeenCalled();

        // show notification and changes the input to danger
        let emailTaken = fixture.debugElement.query(By.css('[data-test=emailTaken]'));
        let notification = fixture.debugElement.query(By.css('.notification'));
        expect(email.classes['is-danger']).toBeTruthy();
        expect(notification.nativeElement.textContent).toEqual(' This email account is already in use. ');
        expect(emailTaken).toBeTruthy();

        // user changes email
        form.email.setValue('aexample@email.com');
        email.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        // email input should be highlighted green and input error message should be gone
        emailTaken = fixture.debugElement.query(By.css('[data-test=emailTaken]'));
        expect(email.classes['is-success']).toBeTruthy();
        expect(emailTaken).toBeFalsy();
      });
    });
  });
});
