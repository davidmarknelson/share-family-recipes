import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '../../../utilities/services/auth/auth.service';
import { EmailVerificationService } from '../../../utilities/services/email-verification/email-verification.service';
import { ProfileViewComponent } from './profile-view.component';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

const user1 = {
  id: 1,
  firstName: "John",
  lastName: "Doe",
  username: "johndoe",
  email: "example@email.com",
  isAdmin: false,
  isVerified: false,
  profilePic: {
    profilePicName: '../../assets/images/default-img/default-profile-pic.jpg'
  },
  createdAt: "Oct 08, 2019",
  updatedAt: "Oct 08, 2019"
};

const user2 = {
  id: 1,
  firstName: "Jack",
  lastName: "Smith",
  username: "jacksmith",
  email: "smith@email.com",
  isAdmin: true,
  isVerified: true,
  profilePic: {
    profilePicName: '../../assets/images/default-img/default-profile-pic.jpg'
  },
  createdAt: "Oct 08, 2019",
  updatedAt: "Oct 08, 2019"
};

class MockAuthService {
  getProfile() {
    return of();
  }
}

class MockRouter {
  navigateByUrl(path) {}
}

class MockEmailService {
  sendVerificationEmail(email) {
    return of();
  }
}

describe('ProfileComponent', () => {
  let component: ProfileViewComponent;
  let fixture: ComponentFixture<ProfileViewComponent>;
  let emailService: EmailVerificationService;
  let authService: AuthService;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileViewComponent ],
      providers: [
        { provide: AuthService, useClass:  MockAuthService },
        { provide: EmailVerificationService, useClass:  MockEmailService },
        { provide: Router, useClass:  MockRouter }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileViewComponent);
    component = fixture.componentInstance;
    authService = fixture.debugElement.injector.get(AuthService);
    emailService = fixture.debugElement.injector.get(EmailVerificationService);
    router = fixture.debugElement.injector.get(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('profile with out profilePic, not an admin, and not verified', () => {
    beforeEach(() => {
      spyOn(component, 'getUserProfile').and.callThrough();
      spyOn(authService, 'getProfile').and.callFake(() => of(user1));
      fixture.detectChanges();
    });

    it('should call getUserProfile when the component initializes', () => {
      expect(component.getUserProfile).toHaveBeenCalled();
      expect(authService.getProfile).toHaveBeenCalled();
    });

    it('should populate the page with the user info', () => {
      const username = fixture.debugElement.query(By.css('[data-test=username]'));
      const name = fixture.debugElement.query(By.css('[data-test=name]'));
      const email = fixture.debugElement.query(By.css('[data-test=email]'));
      const date = fixture.debugElement.query(By.css('[data-test=email]'));
      const profilePic = fixture.debugElement.query(By.css('[data-test=profilePic]'));
      expect(profilePic.properties.src).toEqual('../../assets/images/default-img/default-profile-pic.jpg');
      expect(username).toBeTruthy();
      expect(name).toBeTruthy();
      expect(email).toBeTruthy();
      expect(date).toBeTruthy();
      expect(profilePic).toBeTruthy();
    });

    it('should show a message to verify the email', () => {
      const emailVerifyMsg = fixture.debugElement.query(By.css('[data-test=emailVerifyMsg]'));
      expect(emailVerifyMsg).toBeTruthy();
    });
  });

  describe('verify email message', () => {
    beforeEach(() => {
      spyOn(component, 'getUserProfile').and.callThrough();
      spyOn(authService, 'getProfile').and.callFake(() => of(user1));
      fixture.detectChanges();
    });

    it('should show the sending progressbar when the email is sending', () => {
      const emailVerifyBtn = fixture.debugElement.query(By.css('[data-test=emailVerifyMsg] > p > a'));
      spyOn(emailService, 'sendVerificationEmail').and.callFake(() => of());
      emailVerifyBtn.nativeElement.click();
      fixture.detectChanges();
      expect(emailService.sendVerificationEmail).toHaveBeenCalled();
      const progressbar = fixture.debugElement.query(By.css('[data-test=emailSending]'));
      expect(progressbar).toBeTruthy();
    });

    it('should show the success message when the email has been sent', () => {
      const emailVerifyBtn = fixture.debugElement.query(By.css('[data-test=emailVerifyMsg] > p > a'));
      spyOn(emailService, 'sendVerificationEmail').and.callFake(() => {
        return of({
          message: "Email has successfully been sent."
        });
      });
      emailVerifyBtn.nativeElement.click();
      fixture.detectChanges();
      expect(emailService.sendVerificationEmail).toHaveBeenCalled();
      const emailSuccess = fixture.debugElement.query(By.css('[data-test=emailVerifySuccess]'));
      expect(emailSuccess).toBeTruthy();
    });

    it('should show the error message when there is an error sending the email', () => {
      const emailVerifyBtn = fixture.debugElement.query(By.css('[data-test=emailVerifyMsg] > p > a'));
      spyOn(emailService, 'sendVerificationEmail').and.callFake(() => {
        return throwError({ error: {
          message: "There was an error sending the email."
        }});
      });
      emailVerifyBtn.nativeElement.click();
      fixture.detectChanges();
      expect(emailService.sendVerificationEmail).toHaveBeenCalled();
      const emailError = fixture.debugElement.query(By.css('[data-test=emailVerifyError]'));
      expect(emailError).toBeTruthy();
    });
  });

  describe('profile with a profilePic, an admin, and verified', () => {
    beforeEach(() => {
      spyOn(component, 'getUserProfile').and.callThrough();
      spyOn(authService, 'getProfile').and.callFake(() => of(user2));
      fixture.detectChanges();
    });

    it('should call getUserProfile when the component initializes', () => {
      expect(component.getUserProfile).toHaveBeenCalled();
      expect(authService.getProfile).toHaveBeenCalled();
    });

    it('should populate the page with the user info', () => {
      const username = fixture.debugElement.query(By.css('[data-test=username]'));
      const name = fixture.debugElement.query(By.css('[data-test=name]'));
      const email = fixture.debugElement.query(By.css('[data-test=email]'));
      const date = fixture.debugElement.query(By.css('[data-test=email]'));
      const profilePic = fixture.debugElement.query(By.css('[data-test=profilePic]'));
      expect(profilePic.properties.src).toEqual('../../assets/images/default-img/default-profile-pic.jpg');
      expect(username).toBeTruthy();
      expect(name).toBeTruthy();
      expect(email).toBeTruthy();
      expect(date).toBeTruthy();
      expect(profilePic).toBeTruthy();
    });

    it('should show a message to verify the email', () => {
      const emailVerifyMsg = fixture.debugElement.query(By.css('[data-test=emailVerifyMsg]'));
      expect(emailVerifyMsg).toBeFalsy();
    });

    it('should navigate to the recipes page for the user', () => {
      let yourRecipesBtn = fixture.debugElement.query(By.css('[data-test=your-recipes]'));

      spyOn(router, 'navigateByUrl');

      yourRecipesBtn.nativeElement.click();
      yourRecipesBtn.nativeElement.dispatchEvent(new Event('click'));
      fixture.detectChanges();

      expect(router.navigateByUrl).toHaveBeenCalledWith('/recipes/user-recipes?username=jacksmith');
    });
  });
});
