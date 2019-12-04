import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileViewComponent } from './profile-view/profile-view.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';
import { AuthGuard } from '../../utilities/guards/auth/auth.guard';

const routes: Routes = [
  { path: '', component: ProfileViewComponent, canActivate: [AuthGuard] },
  { path: 'edit', component: EditProfileComponent, canActivate: [AuthGuard] },
  { path: 'edit/password', component: UpdatePasswordComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
