import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EmailVerificationService } from '../services/email-verification/email-verification.service';
import { ActivatedRoute, Router } from "@angular/router";
import { toast } from 'bulma-toast';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  error: string;

  constructor(
    private route: ActivatedRoute, 
    private emailService: EmailVerificationService, 
    private router: Router
  ) { }

  ngOnInit() {
    this.verifyEmail(this.route.snapshot.queryParams['token']);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  verifyEmail(tokenParam) {
    this.emailService.verifyEmail(tokenParam).pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe(res => {
      this.router.navigate(['/profile']);
    }, err => {
      toast({
        message: err.error.message,
        type: "is-danger",
        dismissible: true,
        duration: 5000,
        position: "top-center",
        closeOnClick: true,
        pauseOnHover: true
      });
      this.router.navigate(['/profile']);
    });
  }
}
