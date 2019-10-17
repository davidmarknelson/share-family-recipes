import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileModule } from '../profile.module';
import { UpdatePasswordComponent } from './update-password.component';
import { DebugElement } from '@angular/core';
import { PasswordService } from '../../../utilities/services/password/password.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';

let fixture: ComponentFixture<UpdatePasswordComponent>;
let password: DebugElement;
let passwordConfirmation: DebugElement;
let submitButton: DebugElement;

function selectElements() {
  password = fixture.debugElement.query(By.css('[data-test=password]'));
  passwordConfirmation = fixture.debugElement.query(By.css('[data-test=passwordConfirmation]'));
  submitButton = fixture.debugElement.query(By.css('[data-test=submit-button]'));
}

class MockPasswordService {
  updatePassword(passwords) {}
}

class MockRouter {
  navigate(path) {}
}

describe('UpdatePasswordComponent', () => {
  let component: UpdatePasswordComponent;
  let router: Router;
  let passwordService: PasswordService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ProfileModule,
        RouterTestingModule
      ]
    })
    .overrideComponent(UpdatePasswordComponent, {
      set: {
        providers: [
          { provide: PasswordService, useClass: MockPasswordService }
        ]
      }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePasswordComponent);
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
      let input = component.updatePasswordForm.controls['password'];
      let input2 = component.updatePasswordForm.controls['passwordConfirmation'];

      expect(input.errors['required']).toBeTruthy();
      expect(input2.errors['required']).toBeTruthy();
    });

    it('should show an error when the field is empty and touched', () => {
      let input = component.updatePasswordForm.controls['password'];
      let input2 = component.updatePasswordForm.controls['passwordConfirmation'];

      // PW
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
      let input = component.updatePasswordForm.controls['password'];
      let input2 = component.updatePasswordForm.controls['passwordConfirmation'];

      // PW
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
      let input = component.updatePasswordForm.controls['password'];
      let input2 = component.updatePasswordForm.controls['passwordConfirmation'];

      // PW
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
      let input = component.updatePasswordForm.controls['password'];
      let input2 = component.updatePasswordForm.controls['passwordConfirmation'];

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
      expect(passwordMatch).toBeTruthy();
    });
  });

  describe('form', () => {
    it('should show an error message if the user tries to submit an empty form', () => {
      let form = component.updatePasswordForm.controls;

      spyOn(component, 'onSubmit').and.callThrough();
      spyOn(passwordService, 'updatePassword');

      submitButton.nativeElement.click();
      fixture.detectChanges();

      expect(component.onSubmit).toHaveBeenCalled();
      expect(passwordService.updatePassword).not.toHaveBeenCalled();

      expect(form.password.errors['required']).toBeTruthy();
      expect(form.passwordConfirmation.errors['required']).toBeTruthy();

      // fire events
      password.nativeElement.dispatchEvent(new Event('input'));
      passwordConfirmation.nativeElement.dispatchEvent(new Event('input'));

      fixture.detectChanges();

      // select required messages
      let passwordRequired = fixture.debugElement.query(By.css('[data-test=passwordRequired]'));
      let passwordConfirmationRequired = fixture.debugElement.query(By.css('[data-test=passwordConfirmationRequired]'));

      // show error message expectations
      expect(passwordRequired).toBeTruthy();
      expect(passwordConfirmationRequired).toBeTruthy();

      // show input class expectations
      expect(password.classes['is-danger']).toBeTruthy();
      expect(passwordConfirmation.classes['is-danger']).toBeTruthy();
    });

    it('should show an error message if the passwords do not match', () => {
      let input = component.updatePasswordForm.controls['password'];
      let input2 = component.updatePasswordForm.controls['passwordConfirmation'];

      // PW
      input.setValue('password');
      password.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      // PW confirmation
      input2.setValue('PASSWORD');
      passwordConfirmation.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      spyOn(component, 'onSubmit').and.callThrough();
      spyOn(passwordService, 'updatePassword');

      submitButton.nativeElement.click();
      submitButton.nativeElement.dispatchEvent(new Event('click'));
      
      fixture.detectChanges();

      expect(component.onSubmit).toHaveBeenCalled();
      expect(passwordService.updatePassword).not.toHaveBeenCalled();

      let errorMsg = fixture.debugElement.query(By.css('.notification'));
      expect(errorMsg.nativeElement.innerText).toEqual('Passwords must match.');
    });

    it('should navigate to the profile when the update is successful', () => {
      let input = component.updatePasswordForm.controls['password'];
      let input2 = component.updatePasswordForm.controls['passwordConfirmation'];

      // PW
      input.setValue('password');
      password.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      // PW confirmation
      input2.setValue('password');
      passwordConfirmation.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      spyOn(component, 'onSubmit').and.callThrough();
      spyOn(passwordService, 'updatePassword').and.callFake(() => {
        return of({ message: 'Your password was successfully updated.'});
      });
      spyOn(router, 'navigate');

      submitButton.nativeElement.click();
      submitButton.nativeElement.dispatchEvent(new Event('click'));
      
      fixture.detectChanges();

      expect(component.onSubmit).toHaveBeenCalled();
      expect(passwordService.updatePassword).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/profile']);
    });

    it('should show an error message if there is an error with the api', () => {
      let input = component.updatePasswordForm.controls['password'];
      let input2 = component.updatePasswordForm.controls['passwordConfirmation'];

      // PW
      input.setValue('password');
      password.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      // PW confirmation
      input2.setValue('password');
      passwordConfirmation.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      spyOn(component, 'onSubmit').and.callThrough();
      spyOn(passwordService, 'updatePassword').and.callFake(() => {
        return throwError({ 
          error: { message: 'There was an error updating your password.'}
        });
      });
      spyOn(router, 'navigate');

      submitButton.nativeElement.click();
      submitButton.nativeElement.dispatchEvent(new Event('click'));
      
      fixture.detectChanges();

      expect(component.onSubmit).toHaveBeenCalled();
      expect(passwordService.updatePassword).toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();

      let errorMsg = fixture.debugElement.query(By.css('.notification'));
      expect(errorMsg.nativeElement.innerText).toEqual('There was an error updating your password.');
    });
  });
});
