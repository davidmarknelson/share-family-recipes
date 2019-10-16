import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordResetComponent } from './password-reset.component';
import { LoginModule } from '../login.module';
import { RouterTestingModule } from '@angular/router/testing';
import { PasswordService } from '../../services/password/password.service';
import { of, throwError } from 'rxjs';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

let fixture: ComponentFixture<PasswordResetComponent>;

let resetBtn: DebugElement;
let passwordInput: DebugElement;
let passwordConfirmationInput: DebugElement;

function selectElements() {
  resetBtn = fixture.debugElement.query(By.css('[type=submit]'));
  passwordInput = fixture.debugElement.query(By.css('[data-test=password]'));
  passwordConfirmationInput = fixture.debugElement.query(By.css('[data-test=passwordConfirmation]'));
}

class MockPasswordService {
  resetPassword(credentials) {}
}

describe('PasswordResetComponent', () => {
  let component: PasswordResetComponent;
  let router: Router;
  let passwordService: PasswordService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        LoginModule,
        RouterTestingModule
      ]
    })
    .overrideComponent(PasswordResetComponent, {
      set: {
        providers: [
          { provide: PasswordService, useClass: MockPasswordService }
        ]
      } 
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordResetComponent);
    component = fixture.componentInstance;
    passwordService = fixture.debugElement.injector.get(PasswordService);
    router = fixture.debugElement.injector.get(Router);
    fixture.detectChanges();
    selectElements();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('password inputs', () => {
    it('should be invalid when empty', () => {
      let input = component.resetPasswordForm.controls['password'];
      let input2 = component.resetPasswordForm.controls['passwordConfirmation'];

      expect(input.errors['required']).toBeTruthy();
      expect(input2.errors['required']).toBeTruthy();
    });

    it('should show an error when the field is empty and touched', () => {
      let input = component.resetPasswordForm.controls['password'];
      let input2 = component.resetPasswordForm.controls['passwordConfirmation'];

      // PW
      input.setValue('');
      passwordInput.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      let passwordRequired = fixture.debugElement.query(By.css('[data-test=passwordRequired]'));
      expect(input.errors['required']).toBeTruthy();
      expect(passwordInput.classes['is-danger']).toBeTruthy();
      expect(passwordRequired).toBeTruthy();

      // PW confirmation
      input2.setValue('');
      passwordConfirmationInput.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      let passwordConfirmationRequired = fixture.debugElement.query(By.css('[data-test=passwordConfirmationRequired]'));
      expect(input2.errors['required']).toBeTruthy();
      expect(passwordConfirmationInput.classes['is-danger']).toBeTruthy();
      expect(passwordConfirmationRequired).toBeTruthy();
    });

    it('should show an error when the password is too short', () => {
      let input = component.resetPasswordForm.controls['password'];
      let input2 = component.resetPasswordForm.controls['passwordConfirmation'];

      // PW
      input.setValue('pass');
      passwordInput.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      let passwordLength = fixture.debugElement.query(By.css('[data-test=passwordLength]'));
      expect(input.errors['minlength']).toBeTruthy();
      expect(passwordInput.classes['is-danger']).toBeTruthy();
      expect(passwordLength).toBeTruthy();

      // PW confirmation
      input2.setValue('pass');
      passwordConfirmationInput.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      let passwordConfirmationLength = fixture.debugElement.query(By.css('[data-test=passwordConfirmationLength]'));
      expect(input2.errors['minlength']).toBeTruthy();
      expect(passwordConfirmationInput.classes['is-danger']).toBeTruthy();
      expect(passwordConfirmationLength).toBeTruthy();
    });

    it('should not highlight the input green when the passwords do not match', () => {
      let input = component.resetPasswordForm.controls['password'];
      let input2 = component.resetPasswordForm.controls['passwordConfirmation'];

      // PW
      input.setValue('password');
      passwordInput.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect(passwordInput.classes['is-danger']).toBeFalsy();
      expect(passwordInput.classes['is-success']).toBeFalsy();
      // PW confirmation
      input2.setValue('PASSWORD');
      passwordConfirmationInput.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      let passwordMatch = fixture.debugElement.query(By.css('[data-test=passwordMatch]'));
      expect(passwordConfirmationInput.classes['is-danger']).toBeFalsy();
      expect(passwordConfirmationInput.classes['is-success']).toBeFalsy();
      expect(passwordMatch).toBeFalsy();
    });

    it('should show a success message when the passwords match', () => {
      let input = component.resetPasswordForm.controls['password'];
      let input2 = component.resetPasswordForm.controls['passwordConfirmation'];

      input.setValue('password');
      passwordInput.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      input2.setValue('password');
      passwordConfirmationInput.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      let passwordMatch = fixture.debugElement.query(By.css('[data-test=passwordMatch]'));
      expect(passwordInput.classes['is-danger']).toBeFalsy();
      expect(passwordInput.classes['is-success']).toBeTruthy();
      expect(passwordConfirmationInput.classes['is-danger']).toBeFalsy();
      expect(passwordConfirmationInput.classes['is-success']).toBeTruthy();
      expect(passwordMatch).toBeTruthy();
    });
  });

  describe('form', () => {
    it('should show an error message if the user tries to submit an empty form', () => {
      let form = component.resetPasswordForm.controls;

      spyOn(component, 'onSubmit').and.callThrough();
      spyOn(passwordService, 'resetPassword');

      resetBtn.nativeElement.click();
      fixture.detectChanges();

      expect(component.onSubmit).toHaveBeenCalled();
      expect(passwordService.resetPassword).not.toHaveBeenCalled();

      expect(form.password.errors['required']).toBeTruthy();
      expect(form.passwordConfirmation.errors['required']).toBeTruthy();

      // fire events
      passwordInput.nativeElement.dispatchEvent(new Event('input'));
      passwordConfirmationInput.nativeElement.dispatchEvent(new Event('input'));

      fixture.detectChanges();

      // select required messages
      let passwordRequired = fixture.debugElement.query(By.css('[data-test=passwordRequired]'));
      let passwordConfirmationRequired = fixture.debugElement.query(By.css('[data-test=passwordConfirmationRequired]'));

      // show error message expectations
      expect(passwordRequired).toBeTruthy();
      expect(passwordConfirmationRequired).toBeTruthy();

      // show input class expectations
      expect(passwordInput.classes['is-danger']).toBeTruthy();
      expect(passwordConfirmationInput.classes['is-danger']).toBeTruthy();
    });

    it('should show an error message if the passwords do not match', () => {
      let input = component.resetPasswordForm.controls['password'];
      let input2 = component.resetPasswordForm.controls['passwordConfirmation'];

      // PW
      input.setValue('password');
      passwordInput.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      // PW confirmation
      input2.setValue('PASSWORD');
      passwordConfirmationInput.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      spyOn(component, 'onSubmit').and.callThrough();
      spyOn(passwordService, 'resetPassword');

      resetBtn.nativeElement.click();
      resetBtn.nativeElement.dispatchEvent(new Event('click'));
      
      fixture.detectChanges();

      expect(component.onSubmit).toHaveBeenCalled();
      expect(passwordService.resetPassword).not.toHaveBeenCalled();

      let errorMsg = fixture.debugElement.query(By.css('.notification'));
      expect(errorMsg.nativeElement.innerText).toEqual('Passwords must match.');
    });

    it('should navigate to the login page when the update is successful', () => {
      let input = component.resetPasswordForm.controls['password'];
      let input2 = component.resetPasswordForm.controls['passwordConfirmation'];

      // PW
      input.setValue('password');
      passwordInput.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      // PW confirmation
      input2.setValue('password');
      passwordConfirmationInput.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      spyOn(component, 'onSubmit').and.callThrough();
      spyOn(passwordService, 'resetPassword').and.callFake(() => {
        return of({ message: 'Your password was successfully reset. Please log in with your new password.'});
      });
      spyOn(router, 'navigate');

      resetBtn.nativeElement.click();
      resetBtn.nativeElement.dispatchEvent(new Event('click'));
      
      fixture.detectChanges();

      expect(component.onSubmit).toHaveBeenCalled();
      expect(passwordService.resetPassword).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should show an error message if there is an error with the api', () => {
      let input = component.resetPasswordForm.controls['password'];
      let input2 = component.resetPasswordForm.controls['passwordConfirmation'];

      // PW
      input.setValue('password');
      passwordInput.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      // PW confirmation
      input2.setValue('password');
      passwordConfirmationInput.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      spyOn(component, 'onSubmit').and.callThrough();
      spyOn(passwordService, 'resetPassword').and.callFake(() => {
        return throwError({ 
          error: { message: 'There was an error resetting your password.'}
        });
      });
      spyOn(router, 'navigate');

      resetBtn.nativeElement.click();
      resetBtn.nativeElement.dispatchEvent(new Event('click'));
      
      fixture.detectChanges();

      expect(component.onSubmit).toHaveBeenCalled();
      expect(passwordService.resetPassword).toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();

      let errorMsg = fixture.debugElement.query(By.css('.notification'));
      expect(errorMsg.nativeElement.innerText).toEqual('There was an error resetting your password.');
    });

    it('should reroute to the forgot password page when the token has expired', () => {
      let input = component.resetPasswordForm.controls['password'];
      let input2 = component.resetPasswordForm.controls['passwordConfirmation'];

      // PW
      input.setValue('password');
      passwordInput.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      // PW confirmation
      input2.setValue('password');
      passwordConfirmationInput.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      spyOn(component, 'onSubmit').and.callThrough();
      spyOn(passwordService, 'resetPassword').and.callFake(() => {
        return throwError({ 
          error: { message: 'Password reset token is invalid or has expired. Resend reset email.'}
        });
      });
      spyOn(router, 'navigate');

      resetBtn.nativeElement.click();
      resetBtn.nativeElement.dispatchEvent(new Event('click'));
      
      fixture.detectChanges();

      expect(component.onSubmit).toHaveBeenCalled();
      expect(passwordService.resetPassword).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/login/forgotpassword']);
    });
  });
});
