import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '../services/auth/auth.service';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

class MockRouter {
  navigate(path) {}
}

class MockAuthService {
  loggedIn = of();
  logout = jasmine.createSpy('logout');
  isLoggedIn() {}
  renewToken() {}
}

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavbarComponent ],
      providers: [
        { provide: AuthService, useClass:  MockAuthService },
        { provide: Router, useClass: MockRouter }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    authService = fixture.debugElement.injector.get(AuthService);
    router = fixture.debugElement.injector.get(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('with a user who is logged in', () => {
    beforeEach(() => {
      authService.isLoggedIn = jasmine.createSpy('isLoggedIn').and.returnValue(true);
      spyOn(component, 'renewToken').and.callFake(() => authService.renewToken());
      spyOn(authService, 'renewToken');
      fixture.detectChanges();
    });

    it('should initialize to see if a user is logged in', () => {
      expect(authService.isLoggedIn).toHaveBeenCalled();
      expect(component.isLoggedIn).toEqual(true);
      expect(component.renewToken).toHaveBeenCalled();
      expect(authService.renewToken).toHaveBeenCalled();
    });

    it('should navigate to the home page when logout is clicked', () => {
      spyOn(router, 'navigate');
      const link = fixture.debugElement.query(By.css('[data-test=navbar-logout]'));
      link.nativeElement.click();
      fixture.detectChanges();
      expect(authService.logout).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should have a link to logout visible', () => {
      const link = fixture.debugElement.query(By.css('[data-test=navbar-logout]'));
      expect(link).toBeTruthy();
    });

    it('should not have login and signup visible', () => {
      const login = fixture.debugElement.query(By.css('[data-test=navbar-login]'));
      const signup = fixture.debugElement.query(By.css('[data-test=navbar-signup]'));
      expect(login).toBeFalsy();
      expect(signup).toBeFalsy();
    });
  });

  describe('with a user who is not logged in', () => {
    beforeEach(() => {
      authService.isLoggedIn = jasmine.createSpy('isLoggedIn').and.returnValue(false);
      spyOn(component, 'renewToken');
      spyOn(authService, 'renewToken');
      fixture.detectChanges();
    });

    it('should initialize to see if a user is logged in', () => {
      expect(authService.isLoggedIn).toHaveBeenCalled();
      expect(component.isLoggedIn).toEqual(false);
      expect(component.renewToken).toHaveBeenCalled();
      expect(authService.renewToken).not.toHaveBeenCalled();
    });

    it('should have a link to the homepage when clicking the brand name', () => {
      const link = fixture.debugElement.query(By.css('[data-test=navbar-brand]'));
      expect(link.attributes.routerLink).toEqual('/');
    });

    it('should have a link to the recipes page when clicking the recipe button', () => {
      const link = fixture.debugElement.query(By.css('[data-test=navbar-recipes]'));
      expect(link.attributes.routerLink).toEqual('/recipes');
    });

    it('should have a link to the create recipe page when clicking the create button', () => {
      const link = fixture.debugElement.query(By.css('[data-test=navbar-create]'));
      expect(link.attributes.routerLink).toEqual('/create');
    });

    it('should have a link to the login page when clicking the login button', () => {
      const link = fixture.debugElement.query(By.css('[data-test=navbar-login]'));
      expect(link.attributes.routerLink).toEqual('/login');
    });

    it('should have a link to the signup page when clicking the signup button', () => {
      const link = fixture.debugElement.query(By.css('[data-test=navbar-signup]'));
      expect(link.attributes.routerLink).toEqual('/signup');
    });

    it('should not have logout button', () => {
      const link = fixture.debugElement.query(By.css('[data-test=navbar-logout]'));
      expect(link).toBeFalsy();
    });
  });
});
