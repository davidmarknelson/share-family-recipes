import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { AuthGuard } from '../guards/auth/auth.guard';

const routes: Routes = [
  { path: '', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'edit', component: EditProfileComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
