import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';

import { EditProfileComponent } from './edit-profile.component';
import { AuthService } from '../../../utilities/services/auth/auth.service';
import { ProfileModule } from '../profile.module';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

let fixture: ComponentFixture<EditProfileComponent>;
let firstName: DebugElement;
let lastName: DebugElement;
let email: DebugElement;
let username: DebugElement;
let submitButton: DebugElement;

function selectElements() {
  firstName = fixture.debugElement.query(By.css('[data-test=firstName]'));
  lastName = fixture.debugElement.query(By.css('[data-test=lastName]'));
  email = fixture.debugElement.query(By.css('[data-test=email]'));
  username = fixture.debugElement.query(By.css('[data-test=username]'));
  submitButton = fixture.debugElement.query(By.css('[data-test=submit-button]'));
}

class MockAuthService {
  updateUser(credentials, profilePic) {
    return of()
  }
  checkUsernameAvailability(username) {
    return of()
  }
  deleteUser() {
    return of()
  }
  logout() {
  }
}

class MockRouter {
  navigate(path) {}
}


describe('EditProfileComponent', () => {
  let component: EditProfileComponent;
  let router: Router;
  let authService: AuthService;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ 
        ProfileModule, 
        RouterTestingModule
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .overrideComponent(EditProfileComponent, {
      set: {
        providers: [
          { provide: AuthService, useClass: MockAuthService }
        ]
      }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProfileComponent);
    component = fixture.componentInstance;
    authService = fixture.debugElement.injector.get(AuthService);
    router = fixture.debugElement.injector.get(Router);
    fixture.detectChanges();
    selectElements();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('empty form', () => {
    it('should show an error message if the user tries to submit an empty form', () => {
      submitButton.nativeElement.click();

      fixture.detectChanges();

      let errorMsg = fixture.debugElement.query(By.css('.notification'));
      expect(errorMsg.nativeElement.innerText).toEqual('You must enter information to change your profile.');
    });

    it('should clear the error message when clicking on the x button', () => {
      submitButton.nativeElement.click();

      fixture.detectChanges();

      let errorMsg = fixture.debugElement.query(By.css('.notification'));
      expect(errorMsg).toBeTruthy();

      spyOn(component, 'clearErrorMessage').and.callThrough();

      let errorBtn = fixture.debugElement.query(By.css('.notification > button'));
      errorBtn.nativeElement.click();
      errorBtn.nativeElement.dispatchEvent(new Event('click'));

      fixture.detectChanges();

      expect(component.clearErrorMessage).toHaveBeenCalled();
      errorMsg = fixture.debugElement.query(By.css('.notification'));
      expect(errorMsg).toBeFalsy();
    });
  });

  describe('first name', () => {
    it('should be highlighted green when it is valid', () => {
      let input = component.editProfileForm.controls['firstName'];
      
      input.setValue("John");
      firstName.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect(input.errors).toBeFalsy();
      expect(input.valid).toBeTruthy();
      expect(firstName.classes['is-success']).toBeTruthy();
    });

    it('should be able to submit the form with only the firstName', () => {
      let input = component.editProfileForm.controls['firstName'];
      
      input.setValue("John");
      firstName.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      spyOn(component, 'onSubmit').and.callThrough();
      spyOn(authService, 'updateUser').and.callFake(() => {
        return of({
          message: 'User successfully updated.'
        });
      });
      spyOn(router, 'navigate');

      submitButton.nativeElement.click();
      expect(component.onSubmit).toHaveBeenCalled();
      expect(authService.updateUser).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/profile']);
    });
  });

  describe('last name', () => {
    it('should be highlighted green when it is valid', () => {
      let input = component.editProfileForm.controls['lastName'];
      
      input.setValue("Doe");
      lastName.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect(input.errors).toBeFalsy();
      expect(input.valid).toBeTruthy();
      expect(lastName.classes['is-success']).toBeTruthy();
    });

    it('should be able to submit the form with only the lastName', () => {
      let input = component.editProfileForm.controls['lastName'];
      
      input.setValue("Doe");
      lastName.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      spyOn(component, 'onSubmit').and.callThrough();
      spyOn(authService, 'updateUser').and.callFake(() => {
        return of({
          message: 'User successfully updated.'
        });
      });
      spyOn(router, 'navigate');

      submitButton.nativeElement.click();
      expect(component.onSubmit).toHaveBeenCalled();
      expect(authService.updateUser).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/profile']);
    });
  });

  describe('email', () => {
    it('should highlight the input with green when the text is an email', () => {
      let input = component.editProfileForm.controls['email'];

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

    it('should show an error when the text is not an email', () => {
      let input = component.editProfileForm.controls['email'];

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

    it('should submit the form with only the email field', () => {
      let input = component.editProfileForm.controls['email'];
      
      input.setValue("example@email.com");
      email.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      spyOn(component, 'onSubmit').and.callThrough();
      spyOn(authService, 'updateUser').and.callFake(() => {
        return of({
          message: 'User successfully updated.'
        });
      });
      spyOn(router, 'navigate');

      submitButton.nativeElement.click();
      expect(component.onSubmit).toHaveBeenCalled();
      expect(authService.updateUser).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/profile']);
    });

    it('should show an error message when the email is taken and the remove the input error when the email is changed', () => {
      let input = component.editProfileForm.controls['email'];
      // let form = component.editProfileForm.controls;

      spyOn(component, 'onSubmit').and.callThrough();
      spyOn(authService, 'updateUser').and.callFake(() => {
        return throwError({
          error: {
            message: 'This email account is already in use.'
          } 
        });
      });
      spyOn(router, 'navigate');

      input.setValue("example@email.com");
      email.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      // check that there should not be any errors
      expect(component.editProfileForm.status).toEqual('VALID');
      
      submitButton.nativeElement.click();
      submitButton.nativeElement.dispatchEvent(new Event('click'));
      fixture.detectChanges();
      expect(authService.updateUser).toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();

      // show notification and changes the input to danger
      let emailTaken = fixture.debugElement.query(By.css('[data-test=emailTaken]'));
      let notification = fixture.debugElement.query(By.css('.notification'));
      expect(email.classes['is-danger']).toBeTruthy();
      expect(notification.nativeElement.textContent).toEqual(' This email account is already in use. ');
      expect(emailTaken).toBeTruthy();

      // user changes email
      input.setValue('aexample@email.com');
      email.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      // email input should be highlighted green and input error message should be gone
      emailTaken = fixture.debugElement.query(By.css('[data-test=emailTaken]'));
      expect(email.classes['is-success']).toBeTruthy();
      expect(emailTaken).toBeFalsy();
    });
  });

  describe('username', () => {
    it('should show an error if the username is too short', () => {
      let input = component.editProfileForm.controls['username'];

      input.setValue('user');
      username.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      let usernameMinLength = fixture.debugElement.query(By.css('[data-test=usernameMinLength]'));
      expect(input.errors['minlength']).toBeTruthy();
      expect(username.classes['is-danger']).toBeTruthy();
      expect(usernameMinLength).toBeTruthy();
    });

    it('should show an error if the username is too long', () => {
      let input = component.editProfileForm.controls['username'];

      input.setValue('UsernameThatIsWayTooLong');
      username.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      let usernameMaxLength = fixture.debugElement.query(By.css('[data-test=usernameMaxLength]'));
      expect(input.errors['maxlength']).toBeTruthy();
      expect(username.classes['is-danger']).toBeTruthy();
      expect(usernameMaxLength).toBeTruthy();
    });

    it('should show an error if the username contains a space', () => {
      let input = component.editProfileForm.controls['username'];

      input.setValue('my User');
      username.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      let usernamePattern = fixture.debugElement.query(By.css('[data-test=usernamePattern]'));
      expect(input.errors['pattern']).toBeTruthy();
      expect(username.classes['is-danger']).toBeTruthy();
      expect(usernamePattern).toBeTruthy();
    });

    it('should show a success message if the username is available', fakeAsync(() => {
      let input = component.editProfileForm.controls['username'];

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
      let input = component.editProfileForm.controls['username'];

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

    it('should submit the form with only the username', fakeAsync(() => {
      let input = component.editProfileForm.controls['username'];

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

      spyOn(component, 'onSubmit').and.callThrough();
      spyOn(authService, 'updateUser').and.callFake(() => {
        return of({
          message: 'Profile successfully updated.'
        });
      });
      spyOn(router, 'navigate');

      submitButton.nativeElement.click();
      expect(component.onSubmit).toHaveBeenCalled();
      expect(authService.updateUser).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/profile']);
    }));
  });

  describe('deleteUser', () => {
    it('should open the modal when clicking on the delete button and close when clicking the x', () => {
      let deleteBtn = fixture.debugElement.query(By.css('[data-test=delete-button]'));
      let modal = fixture.debugElement.query(By.css('.modal'));
      let modalClose = fixture.debugElement.query(By.css('[data-test=modal-close]'));

      deleteBtn.nativeElement.click();
      fixture.detectChanges();
      
      expect(component.isModalOpen).toEqual(true);
      expect(modal.classes['is-active']).toEqual(true);

      modalClose.nativeElement.click();
      fixture.detectChanges();

      expect(component.isModalOpen).toEqual(false);
      expect(modal.classes['is-active']).toEqual(false);
    });

    it('should navigate to the landing page when successfully deleting the profile', () => {
      let deleteBtn = fixture.debugElement.query(By.css('[data-test=delete-button]'));
      let modalDelete = fixture.debugElement.query(By.css('[data-test=modal-delete]'));
      let modalClose = fixture.debugElement.query(By.css('[data-test=modal-close]'));

      spyOn(component, 'deleteUser').and.callThrough();
      spyOn(authService, 'deleteUser').and.callFake(() => {
        return of({ message: 'Profile successfully deleted.'});
      });
      spyOn(router, 'navigate');
      spyOn(authService, 'logout');

      deleteBtn.nativeElement.click();
      fixture.detectChanges();

      modalDelete.nativeElement.click();
      fixture.detectChanges();

      expect(component.deleteUser).toHaveBeenCalled();
      expect(authService.deleteUser).toHaveBeenCalled();
      expect(authService.logout).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/']);

      // close the modal in the testing window
      modalClose.nativeElement.click();
      fixture.detectChanges();
    });

    it('should show an error message on error', () => {
      let deleteBtn = fixture.debugElement.query(By.css('[data-test=delete-button]'));
      let modalDelete = fixture.debugElement.query(By.css('[data-test=modal-delete]'));

      spyOn(component, 'deleteUser').and.callThrough();
      spyOn(authService, 'deleteUser').and.callFake(() => {
        return throwError({ error: { 
          message: 'There was an error deleting your profile.'
        }});
      });
      spyOn(router, 'navigate');
      spyOn(authService, 'logout');

      deleteBtn.nativeElement.click();
      fixture.detectChanges();

      modalDelete.nativeElement.click();
      fixture.detectChanges();

      let errorMsg = fixture.debugElement.query(By.css('.notification'));

      expect(component.deleteUser).toHaveBeenCalled();
      expect(authService.deleteUser).toHaveBeenCalled();
      expect(authService.logout).not.toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
      expect(errorMsg.nativeElement.innerText).toEqual('There was an error deleting your profile.');
    });
  });
});
