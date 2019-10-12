import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyEmailComponent } from './verify-email.component';
import { EmailVerificationService } from '../services/email-verification/email-verification.service';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

class MockEmailService {
  verifyEmail(token) {
    return of()
  }
}

class MockRouter {
  navigate(path) {}
}

class MockActivatedRoute {
  snapshot = { queryParams: { token: '1234567890' } };
}

describe('VerifyEmailComponent', () => {
  let component: VerifyEmailComponent;
  let fixture: ComponentFixture<VerifyEmailComponent>;
  let emailService: EmailVerificationService;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyEmailComponent ],
      providers: [
        { provide: EmailVerificationService, useClass:  MockEmailService },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: Router, useClass: MockRouter }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyEmailComponent);
    component = fixture.componentInstance;
    emailService = fixture.debugElement.injector.get(EmailVerificationService);
    router = fixture.debugElement.injector.get(Router);
    activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should call email service when initialized', () => {
    spyOn(component, 'verifyEmail');
    fixture.detectChanges();
    expect(component.verifyEmail).toHaveBeenCalledWith('1234567890');
  });

  it('should navigate to the profile page with a successfully response', () => {
    spyOn(router, 'navigate');
    spyOn(emailService, 'verifyEmail').and.callFake(() => of(router.navigate(['/profile'])))
    fixture.detectChanges();
    expect(router.navigate).toHaveBeenCalledWith(['/profile']);
    expect(emailService.verifyEmail).toHaveBeenCalled();
  });

  it('should navigate to the profile page with an error response', () => {
    spyOn(router, 'navigate');
    let toastSpy = jasmine.createSpy('toast');
    spyOn(emailService, 'verifyEmail').and.callFake(() => {
      toastSpy();
      return throwError({
        error: {
          message: 'There was an error verifying your email.'
        }
      });
    });
    fixture.detectChanges();
    expect(toastSpy).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/profile']);
    expect(emailService.verifyEmail).toHaveBeenCalled();
  });
});
