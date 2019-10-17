import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// Components
import { LandingPageComponent } from './pages/landing-page/landing-page.component';


const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'signup', loadChildren: () => import('./pages/signup/signup.module').then(m => m.SignupModule) },
  { path: 'profile', loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfileModule) },
  { path: 'verify', loadChildren: () => import('./pages/verify-email/verify-email.module').then(m => m.VerifyEmailModule) },
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule) }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
