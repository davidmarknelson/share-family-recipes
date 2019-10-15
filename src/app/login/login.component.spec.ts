import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '../services/auth/auth.service';
import { LoginComponent } from './login.component';
import { DebugElement } from '@angular/core';
import { LoginModule } from './login.module';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';

let fixture: ComponentFixture<LoginComponent>;

class LoginPage {
  loginBtn: DebugElement;
  emailInput: HTMLInputElement;
  passwordInput: HTMLInputElement;

  selectElements() {
    this.loginBtn = fixture.debugElement.query(By.css('button'));
    this.emailInput = fixture.debugElement.query(By.css('[name=email]')).nativeElement;
    this.passwordInput = fixture.debugElement.query(By.css('[name=password]')).nativeElement;
  }
}

class MockRouter {
  navigate(path) {}
}

class MockLocation {
  back() {}
}

class MockAuthService {
  login(credentials) {}
}


describe('LoginComponent', () => {
  let component: LoginComponent;
  let authService: AuthService;
  let router: Router;
  let location: Location;
  let loginPage: LoginPage;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ LoginModule ]
    })
    .overrideComponent(LoginComponent, {
      set: {
        providers: [
          { provide: AuthService, useClass: MockAuthService },
          { provide: Router, useClass: MockRouter },
          { provide: Location, useClass: MockLocation }
        ]
      } 
    })
    .compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    loginPage = new LoginPage();
    authService = fixture.debugElement.injector.get(AuthService);
    router = fixture.debugElement.injector.get(Router);
    fixture.detectChanges();
    return fixture.whenStable().then(() => {
      fixture.detectChanges();
      loginPage.selectElements();
    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show an error message if the email input is empty', () => {
    loginPage.passwordInput.value = 'password';
    loginPage.passwordInput.dispatchEvent(new Event('input'));
    loginPage.loginBtn.nativeElement.click();
    fixture.detectChanges();
    let errorMsg = fixture.debugElement.query(By.css('.notification'));
    expect(errorMsg.nativeElement.innerText).toContain('Email and password are required.');
  });

  it('should show an error message if the password input is empty', () => {
    loginPage.emailInput.value = 'test@email.com';
    loginPage.emailInput.dispatchEvent(new Event('input'));
    loginPage.loginBtn.nativeElement.click();
    fixture.detectChanges();
    let errorMsg = fixture.debugElement.query(By.css('.notification'));
    expect(errorMsg.nativeElement.innerText).toContain('Email and password are required.');
  });

  it('should show an error message if the password and email input are empty', () => {
    loginPage.loginBtn.nativeElement.click();
    fixture.detectChanges();
    let errorMsg = fixture.debugElement.query(By.css('.notification'));
    expect(errorMsg.nativeElement.innerText).toContain('Email and password are required.');
  });

  it('should show an error message if the login credentials are incorrect', () => {
    loginPage.emailInput.value = 'wrong@email.com';
    loginPage.passwordInput.value = 'password';
    loginPage.emailInput.dispatchEvent(new Event('input'));
    loginPage.passwordInput.dispatchEvent(new Event('input'));

    spyOn(component, 'login').and.callThrough();
    spyOn(authService, 'login').and.callFake(() => {
      return throwError({ error: { message: 'The login information was incorrect.' }});
    });

    loginPage.loginBtn.nativeElement.click();


    fixture.detectChanges();

    expect(component.login).toHaveBeenCalled();
    expect(authService.login).toHaveBeenCalled();

    let errorMsg = fixture.debugElement.query(By.css('.notification'));
    expect(errorMsg.nativeElement.innerText).toContain('The login information was incorrect.');
  });

  it('should remove the error message when clicking on the x button', () => {
    loginPage.loginBtn.nativeElement.click();
    fixture.detectChanges();

    let errorMsg = fixture.debugElement.query(By.css('.notification'));
    expect(errorMsg.nativeElement.innerText).toContain('Email and password are required.');

    let deleteBtn = fixture.debugElement.query(By.css('.delete'));
    spyOn(component, 'clearErrorMessage').and.callThrough();
    deleteBtn.nativeElement.click();
    deleteBtn.nativeElement.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    expect(component.clearErrorMessage).toHaveBeenCalled();
    errorMsg = fixture.debugElement.query(By.css('.notification'));
    expect(errorMsg).toBeFalsy();
  });

  it('should navigate to the profile when the login credentials are correct', () => {
    loginPage.emailInput.value = 'test@email.com';
    loginPage.passwordInput.value = 'password';
    loginPage.emailInput.dispatchEvent(new Event('input'));
    loginPage.passwordInput.dispatchEvent(new Event('input'));

    spyOn(authService, 'login').and.callFake(() => {
      return of({ jwt: 'token' });
    });
    spyOn(router, 'navigate');

    loginPage.loginBtn.nativeElement.click();
    fixture.detectChanges();
    expect(authService.login).toHaveBeenCalledWith({
      email: 'test@email.com',
      password: 'password'
    });
    expect(router.navigate).toHaveBeenCalledWith(['/profile']);
  });
});
