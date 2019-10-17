import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';
import { AdminComponent } from './admin/admin.component';
import { AuthGuard } from '../../utilities/guards/auth/auth.guard';
import { AdminGuard } from '../../utilities/guards/admin/admin.guard'

const routes: Routes = [
  { path: '', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'edit', component: EditProfileComponent, canActivate: [AuthGuard] },
  { path: 'edit/password', component: UpdatePasswordComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
