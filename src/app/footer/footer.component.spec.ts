import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterComponent } from './footer.component';
import { By } from '@angular/platform-browser';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('with a user who is not logged in', () => {
    it('should have a link to the homepage when clicking the home link', () => {
      const link = fixture.debugElement.query(By.css('[data-test=footer-home]'));
      expect(link.attributes.routerLink).toEqual('/');
    });

    it('should have a link to the recipes page when clicking the recipe link', () => {
      const link = fixture.debugElement.query(By.css('[data-test=footer-recipes]'));
      expect(link.attributes.routerLink).toEqual('/recipes');
    });

    it('should have a link to the create recipe page when clicking the create link', () => {
      const link = fixture.debugElement.query(By.css('[data-test=footer-create]'));
      expect(link.attributes.routerLink).toEqual('/create');
    });

    it('should have a link to the signup page when clicking the signup link', () => {
      const link = fixture.debugElement.query(By.css('[data-test=footer-signup]'));
      expect(link.attributes.routerLink).toEqual('/signup');
    });

    it('should have a link to the login page when clicking the login link', () => {
      const link = fixture.debugElement.query(By.css('[data-test=footer-login]'));
      expect(link.attributes.routerLink).toEqual('/login');
    });

    it('should have a link to the signup page when clicking the signup link', () => {
      const link = fixture.debugElement.query(By.css('[data-test=footer-about]'));
      expect(link.attributes.routerLink).toEqual('/about');
    });

    it('should have a link to the login page when clicking the login link', () => {
      const link = fixture.debugElement.query(By.css('[data-test=footer-contact]'));
      expect(link.attributes.routerLink).toEqual('/contact');
    });
  });
});
