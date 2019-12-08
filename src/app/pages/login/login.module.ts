import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginViewComponent } from './login-view/login-view.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [LoginViewComponent, ForgotPasswordComponent, PasswordResetComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    FormsModule,
    FontAwesomeModule,
    ReactiveFormsModule
  ]
})
export class LoginModule { }
