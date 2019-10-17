import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
// Components
import { ProfileComponent } from './profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
// Forms
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
// Font Awesome
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UpdatePasswordComponent } from './update-password/update-password.component';
import { AdminComponent } from './admin/admin.component';
// Pagination
import { PaginationModule } from '../../partials/pagination/pagination.module';

@NgModule({
  declarations: [ProfileComponent, EditProfileComponent, UpdatePasswordComponent, AdminComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    // Forms
    ReactiveFormsModule,
    FormsModule,
    // Font Awesome
    FontAwesomeModule,
    // Pagination
    PaginationModule
  ]
})
export class ProfileModule { }
