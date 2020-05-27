import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ProfileRoutingModule } from "./profile-routing.module";
import { EmailMessageModule } from "@partials/email-message/email-message.module";
// Components
import { ProfileViewComponent } from "./profile-view/profile-view.component";
import { EditProfileComponent } from "./edit-profile/edit-profile.component";
import { UpdatePasswordComponent } from "./update-password/update-password.component";
// Forms
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
// Font Awesome
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ImageUploadModule } from "../../partials/image-upload/image-upload.module";

@NgModule({
	declarations: [
		ProfileViewComponent,
		EditProfileComponent,
		UpdatePasswordComponent
	],
	imports: [
		CommonModule,
		ProfileRoutingModule,
		EmailMessageModule,
		// Forms
		ReactiveFormsModule,
		FormsModule,
		// Font Awesome
		FontAwesomeModule,
		ImageUploadModule
	]
})
export class ProfileModule {}
