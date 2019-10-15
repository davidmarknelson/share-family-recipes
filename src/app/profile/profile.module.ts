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

@NgModule({
  declarations: [ProfileComponent, EditProfileComponent, UpdatePasswordComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    // Forms
    ReactiveFormsModule,
    FormsModule,
    // Font Awesome
    FontAwesomeModule
  ]
})
export class ProfileModule { }
