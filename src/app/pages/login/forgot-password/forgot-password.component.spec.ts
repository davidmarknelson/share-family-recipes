import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPasswordComponent } from './forgot-password.component';
import { LoginModule } from '../login.module';
import { RouterTestingModule } from '@angular/router/testing';
import { PasswordService } from '../../../utilities/services/password/password.service';
import { of, throwError } from 'rxjs';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

let fixture: ComponentFixture<ForgotPasswordComponent>;

class ForgotPasswordPage {
  sendEmailBtn: DebugElement;
  emailInput: HTMLInputElement;

  selectElements() {
    this.sendEmailBtn = fixture.debugElement.query(By.css('[type=submit]'));
    this.emailInput = fixture.debugElement.query(By.css('[name=email]')).nativeElement;
  }
}

class MockPasswordService {
  sendResetEmail(email) {}
}

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let forgotPasswordPage: ForgotPasswordPage;
  let passwordService: PasswordService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        LoginModule,
        RouterTestingModule
      ]
    })
    .overrideComponent(ForgotPasswordComponent, {
      set: {
        providers: [
          { provide: PasswordService, useClass: MockPasswordService }
        ]
      } 
    })
    .compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;

    forgotPasswordPage = new ForgotPasswordPage();
    passwordService = fixture.debugElement.injector.get(PasswordService);
    fixture.detectChanges();
    return fixture.whenStable().then(() => {
      fixture.detectChanges();
      forgotPasswordPage.selectElements();
    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('empty form', () => {
    it('should show an error message if the user tries to submit', () => {
      forgotPasswordPage.sendEmailBtn.nativeElement.click();
      fixture.detectChanges();

      let errorMsg = fixture.debugElement.query(By.css('.notification'));
      expect(errorMsg.nativeElement.innerText).toContain('Email is required.');
    });
  });

  describe('Submit', () => {
    it('should show a sending indicator while the email is sending', () => {
      forgotPasswordPage.emailInput.value = 'test@email.com';
      forgotPasswordPage.emailInput.dispatchEvent(new Event('input'));

      spyOn(component, 'sendEmail').and.callThrough();
      spyOn(passwordService, 'sendResetEmail').and.callFake(() => {
        return of();
      });
      forgotPasswordPage.sendEmailBtn.nativeElement.click();
      fixture.detectChanges();

      let progressBar = fixture.debugElement.query(By.css('[data-test=emailSending]'));
      expect(progressBar).toBeTruthy();
    });

    it('should show an error message if the email does not exist', () => {
      forgotPasswordPage.emailInput.value = 'test@email.com';
      forgotPasswordPage.emailInput.dispatchEvent(new Event('input'));

      spyOn(component, 'sendEmail').and.callThrough();
      spyOn(passwordService, 'sendResetEmail').and.callFake(() => {
        return throwError({
          error: { message: "No account with that email address exists." }
        });
      });
      forgotPasswordPage.sendEmailBtn.nativeElement.click();
      fixture.detectChanges();

      let progressBar = fixture.debugElement.query(By.css('[data-test=emailSending]'));
      expect(progressBar).toBeFalsy();

      let errorMsg = fixture.debugElement.query(By.css('.notification.is-danger'));
      expect(errorMsg.nativeElement.innerText).toEqual('No account with that email address exists.');
    });

    it('should show a success message when the email has been sent', () => {
      forgotPasswordPage.emailInput.value = 'test@email.com';
      forgotPasswordPage.emailInput.dispatchEvent(new Event('input'));

      spyOn(component, 'sendEmail').and.callThrough();
      spyOn(passwordService, 'sendResetEmail').and.callFake(() => {
        forgotPasswordPage.emailInput.value = '';
        forgotPasswordPage.emailInput.dispatchEvent(new Event('input'));
        return of({ 
          message: "An email has been sent to test@email.com with further instructions." 
        });
      });
      forgotPasswordPage.sendEmailBtn.nativeElement.click();
      fixture.detectChanges();

      let progressBar = fixture.debugElement.query(By.css('[data-test=emailSending]'));
      expect(progressBar).toBeFalsy();

      let errorMsg = fixture.debugElement.query(By.css('.notification.is-danger'));
      expect(errorMsg).toBeFalsy();

      let successMsg = fixture.debugElement.query(By.css('[data-test=emailSuccess]'));
      expect(successMsg).toBeTruthy();

      // The input should be cleared when there is a successful response
      expect(forgotPasswordPage.emailInput.value).toEqual('');
    });
  });
});
