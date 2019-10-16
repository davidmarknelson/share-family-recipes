import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'forgotpassword', component: ForgotPasswordComponent },
  { path: 'forgotpassword/reset', component: PasswordResetComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
