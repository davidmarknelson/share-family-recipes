import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarComponent } from './navbar.component';
import { By } from '@angular/platform-browser';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('with a user who is not logged in', () => {
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
  });
});