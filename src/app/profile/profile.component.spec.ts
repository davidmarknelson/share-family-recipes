import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AuthService } from '../services/auth/auth.service';
import { EmailVerificationService } from '../services/email-verification/email-verification.service';
import { ProfileComponent } from './profile.component';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

const user1 = {
  id: 1,
  firstName: "John",
  lastName: "Doe",
  username: "johndoe",
  originalUsername: "johndoe",
  email: "example@email.com",
  isAdmin: false,
  isVerified: false,
  profilePic: '../../assets/images/default-img/default-profile-pic.jpg',
  createdAt: "Oct 08, 2019",
  updatedAt: "Oct 08, 2019"
};

const user2 = {
  id: 1,
  firstName: "Jack",
  lastName: "Smith",
  username: "jacksmith",
  originalUsername: "jacksmith",
  email: "smith@email.com",
  isAdmin: true,
  isVerified: true,
  profilePic: 'http://localhost:3000/public/images/profilePics/jacksmith.jpeg',
  createdAt: "Oct 08, 2019",
  updatedAt: "Oct 08, 2019"
};

class MockAuthService {
  getProfile() {
    return of();
  }
}

class MockEmailService {
  sendVerificationEmail(email) {
    return of();
  }
}

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let emailService: EmailVerificationService;
  let authService: AuthService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileComponent ],
      providers: [
        { provide: AuthService, useClass:  MockAuthService },
        { provide: EmailVerificationService, useClass:  MockEmailService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    authService = fixture.debugElement.injector.get(AuthService);
    emailService = fixture.debugElement.injector.get(EmailVerificationService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('profile with out profilePic, not an admin, and not verified', () => {
    beforeEach(() => {
      spyOn(component, 'getUserProfile').and.callFake(() => component.user = user1);
      fixture.detectChanges();
    });

    it('should call getUserProfile when the component initializes', () => {
      expect(component.getUserProfile).toHaveBeenCalled();
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
      spyOn(component, 'getUserProfile').and.callFake(() => component.user = user1);
      fixture.detectChanges();
    });

    it('should show the sending progressbar when the email is sending', () => {
      const emailVerifyBtn = fixture.debugElement.query(By.css('[data-test=emailVerifyMsg] > p > a'));
      emailVerifyBtn.nativeElement.click();
      fixture.detectChanges();
      const progressbar = fixture.debugElement.query(By.css('[data-test=emailSending]'));
      expect(progressbar).toBeTruthy();
    });
  });

  describe('profile with a profilePic, an admin, and verified', () => {
    beforeEach(() => {
      spyOn(component, 'getUserProfile').and.callFake(() => component.user = user2);
      fixture.detectChanges();
    });

    it('should call getUserProfile when the component initializes', () => {
      expect(component.getUserProfile).toHaveBeenCalled();
    });

    it('should populate the page with the user info', () => {
      const username = fixture.debugElement.query(By.css('[data-test=username]'));
      const name = fixture.debugElement.query(By.css('[data-test=name]'));
      const email = fixture.debugElement.query(By.css('[data-test=email]'));
      const date = fixture.debugElement.query(By.css('[data-test=email]'));
      const profilePic = fixture.debugElement.query(By.css('[data-test=profilePic]'));
      expect(profilePic.properties.src).toEqual('http://localhost:3000/public/images/profilePics/jacksmith.jpeg');
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
  });
});
