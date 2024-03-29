import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil, filter, debounceTime, mergeMap } from "rxjs/operators";
import { Router } from "@angular/router";
// Forms
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
// Services
import { AuthService } from "@services/auth/auth.service";
// Font Awesome
import {
	faUser,
	faEnvelope,
	faChevronRight
} from "@fortawesome/free-solid-svg-icons";
import { UploadedImage } from "@interfaces/uploadedImage";
// Facades
import { UserFacadeService } from "@facades/user-facade/user-facade.service";

@Component({
	selector: "app-edit-profile",
	templateUrl: "./edit-profile.component.html",
	styleUrls: ["./edit-profile.component.scss"]
})
export class EditProfileComponent implements OnInit, OnDestroy {
	private ngUnsubscribe = new Subject();
	editProfileForm: FormGroup;
	sendingForm: boolean = false;
	availableUsername: boolean;
	formError: string;
	emailTaken: boolean;
	takenUsername: boolean;
	// Font Awesome
	faEnvelope = faEnvelope;
	faUser = faUser;
	faChevronRight = faChevronRight;
	// Modal
	isModalOpen: boolean = false;
	isDeleting: boolean = false;
	// image
	uploadedImage: UploadedImage;
	isImageLoading: boolean;
	isSendingDeleteToken: boolean;

	constructor(
		private auth: AuthService,
		private fb: FormBuilder,
		private router: Router,
		private userFacade: UserFacadeService
	) {}

	ngOnInit() {
		this.createForm();
		this.onUsernameChanges();
		this.onTakenEmailChanges();
	}

	ngOnDestroy() {
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}

	createForm() {
		this.editProfileForm = this.fb.group({
			firstName: [""],
			lastName: [""],
			email: ["", Validators.email],
			username: [
				"",
				[
					Validators.minLength(5),
					Validators.maxLength(15),
					Validators.pattern("[^ ]*")
				]
			],
			profilePic: [null]
		});
	}

	// This gives the template easier access to the form
	get firstName() {
		return this.editProfileForm.get("firstName");
	}
	get lastName() {
		return this.editProfileForm.get("lastName");
	}
	get email() {
		return this.editProfileForm.get("email");
	}
	get username() {
		return this.editProfileForm.get("username");
	}

	// This checks for available usernames
	onUsernameChanges() {
		this.editProfileForm
			.get("username")
			.valueChanges.pipe(
				filter(val => val.length >= 5 && val.length <= 15),
				debounceTime(500),
				mergeMap(val => this.auth.checkUsernameAvailability(val)),
				takeUntil(this.ngUnsubscribe)
			)
			.subscribe(
				res => {
					this.availableUsername = true;
				},
				err => {
					this.availableUsername = false;
					// The api returns a 400 error when the username is taken.
					// The resubscribes to the observable because subscriptions
					// complete on errors.
					this.onUsernameChanges();
				}
			);
	}

	// When there is an error saying that an email is already in use, the user will
	// change the email. After the user changes the email, this removes the error
	// message on the input.
	onTakenEmailChanges() {
		this.editProfileForm
			.get("email")
			.valueChanges.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe(() => {
				if (this.emailTaken) this.emailTaken = false;
			});
	}

	createUserObject() {
		const user = {};
		for (const key of Object.keys(this.editProfileForm.value)) {
			if (this.editProfileForm.value[key] && key !== "profilePic") {
				user[key] = this.editProfileForm.value[key];
			}
		}
		return user;
	}

	onImageUpload(uploadedImage: UploadedImage) {
		this.uploadedImage = uploadedImage;
	}

	onImageLoading(isImageLoading: boolean) {
		this.isImageLoading = isImageLoading;
	}

	onImageDelete(isSendingDeleteToken: boolean) {
		this.isSendingDeleteToken = isSendingDeleteToken;
	}

	onSubmit() {
		const user: any = this.createUserObject();

		// Stops the form from submitting while the image is uploading
		if (this.isImageLoading) {
			return (this.formError =
				"You cannot submit the form while your image is loading.");
		}

		// Stops the form from submitting while the image is deleting
		if (this.isSendingDeleteToken) {
			return (this.formError =
				"You cannot submit the form while your image is deleting.");
		}

		// This stops the form submisson if the form is empty
		if (Object.getOwnPropertyNames(user).length === 0 && !this.uploadedImage) {
			this.formError = "You must enter information to change your profile.";
			return;
		}

		// This stops the form submission if the form is invalid
		if (
			this.availableUsername === false ||
			this.editProfileForm.status === "INVALID"
		)
			return;

		// This is to show a loading indicator
		this.sendingForm = true;

		// set image property defaults
		user.profilePicName = null;
		user.publicId = null;

		// Add image properties to user object if the image has uploaded
		if (this.uploadedImage) {
			user.profilePicName = this.uploadedImage.secure_url;
			user.publicId = this.uploadedImage.public_id;
		}

		this.auth
			.updateUser(user)
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe(
				res => {
					this.userFacade.updateUser(res);
					this.router.navigate(["/profile"]);
				},
				err => {
					// These 2 if statements show errors on the related inputs.
					if (err.error.message === "This email account is already in use.")
						this.emailTaken = true;
					if (err.error.message === "This username is already taken.")
						this.availableUsername = false;

					// This stops the loading indicator
					this.sendingForm = false;
					// This shows the error message
					this.formError = err.error.message;
				}
			);
	}

	toggleModal() {
		// Stops the form from submitting while the image is uploading
		if (this.isImageLoading) {
			return (this.formError =
				"You cannot delete your profile while your image is loading.");
		}

		// Stops the form from submitting while the image is deleting
		if (this.isSendingDeleteToken) {
			return (this.formError =
				"You cannot delete your profile while your image is deleting.");
		}

		this.isModalOpen = !this.isModalOpen;
	}

	deleteUser() {
		// Stops the form from submitting while the image is uploading
		if (this.isImageLoading) {
			return (this.formError =
				"You cannot submit the form while your image is loading.");
		}

		// Stops the form from submitting while the image is deleting
		if (this.isSendingDeleteToken) {
			return (this.formError =
				"You cannot submit the form while your image is deleting.");
		}

		this.isDeleting = true;
		this.auth.deleteUser().subscribe(
			res => {
				this.isDeleting = false;
				this.userFacade.logoutUser();
			},
			err => {
				this.isDeleting = false;
				this.isModalOpen = false;
				this.formError = err.error.message;
			}
		);
	}

	clearErrorMessage() {
		this.formError = "";
	}
}
