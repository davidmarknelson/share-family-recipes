import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyEmailComponent } from './verify-email.component';
import { EmailVerificationService } from '../services/email-verification/email-verification.service';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
