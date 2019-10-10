import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// Services
import { AuthService } from '../services/auth/auth.service';
import { EmailVerificationService } from '../services/email-verification/email-verification.service';
// Interfaces
import { User } from '../services/auth/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  gettingProfile: boolean;
  user: User;
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
    ).subscribe(res => {
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
