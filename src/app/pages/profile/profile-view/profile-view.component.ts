import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// Services
import { AuthService } from '../../../utilities/services/auth/auth.service';
import { EmailVerificationService } from '../../../utilities/services/email-verification/email-verification.service';
// Interfaces
import { UserProfile } from '../../../utilities/services/auth/user-profile';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss']
})
export class ProfileViewComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  gettingProfile: boolean;
  user: UserProfile;
  emailSent: boolean = false;
  sendingEmail: boolean = false;
  emailSuccess: boolean = false;
  emailError: string;

  constructor(private auth: AuthService, private email: EmailVerificationService) { }

  ngOnInit() {
    this.getUserProfile();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getUserProfile() {
    this.gettingProfile = true;
    this.auth.getProfile().pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe((res: UserProfile) => {
      this.gettingProfile = false;
      this.user = res;
    });
  }

  sendVerificationEmail() {
    this.sendingEmail = true;
    this.email.sendVerificationEmail(this.user.email).pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe(res => {
      this.sendingEmail = false;
      this.emailError = '';
      this.emailSuccess = true;
    }, err => {
      this.sendingEmail = false;
      this.emailError = err.error.message;
    });
  }
}
