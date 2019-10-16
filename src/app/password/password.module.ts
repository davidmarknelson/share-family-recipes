import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PasswordRoutingModule } from './password-routing.module';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [ForgotPasswordComponent, PasswordResetComponent],
  imports: [
    CommonModule,
    PasswordRoutingModule,
    FormsModule,
    FontAwesomeModule
  ]
})
export class PasswordModule { }
