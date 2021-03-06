import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil, filter, debounceTime, mergeMap } from "rxjs/operators";
import { Router } from "@angular/router";
import { Location } from "@angular/common";
// Font Awesome
import { faLock, faUser, faEnvelope } from "@fortawesome/free-solid-svg-icons";
// Services
import { AuthService } from "../../utilities/services/auth/auth.service";
import { UploadedImage } from "../../utilities/interfaces/uploadedImage";
// Facade
import { UserFacadeService } from "@facades/user-facade/user-facade.service";

@Component({
	selector: "app-signup",
	templateUrl: "./signup.component.html",
	styleUrls: ["./signup.component.scss"]
})
export class SignupComponent implements OnInit, OnDestroy {
	private ngUnsubscribe = new Subject();
	// Font Awesome
	faEnvelope = faEnvelope;
	faLock = faLock;
	faUser = faUser;
	// Component
	showAdminField: boolean = false;
	sendingForm: boolean = false;
	submitted: boolean = false;
	availableUsername: boolean;
	signupForm: FormGroup;
	formError: string;
	emailTaken: boolean;
	takenUsername: boolean;
	// image
	uploadedImage: UploadedImage;
	isImageLoading: boolean;
	isSendingDeleteToken: boolean;

	constructor(
		private fb: FormBuilder,
		private auth: AuthService,
		private router: Router,
		private location: Location,
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

	// This checks for available usernames
	onUsernameChanges() {
		this.signupForm
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
		this.signupForm
			.get("email")
			.valueChanges.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe(() => {
				if (this.emailTaken) this.emailTaken = false;
			});
	}

	createForm() {
		this.signupForm = this.fb.group({
			firstName: ["", Validators.required],
			lastName: ["", Validators.required],
			email: ["", [Validators.required, Validators.email]],
			username: [
				"",
				[
					Validators.required,
					Validators.minLength(5),
					Validators.maxLength(15),
					Validators.pattern("[^ ]*")
				]
			],
			password: ["", [Validators.required, Validators.minLength(8)]],
			passwordConfirmation: [
				"",
				[Validators.required, Validators.minLength(8)]
			],
			adminCode: [""]
		});
	}

	// This gives the template easier access to the form
	get firstName() {
		return this.signupForm.get("firstName");
	}
	get lastName() {
		return this.signupForm.get("lastName");
	}
	get email() {
		return this.signupForm.get("email");
	}
	get username() {
		return this.signupForm.get("username");
	}
	get password() {
		return this.signupForm.get("password");
	}
	get passwordConfirmation() {
		return this.signupForm.get("passwordConfirmation");
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
		// This helps show errors on the form if a user tries to submit
		// the form before completing it
		this.submitted = true;

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

		// This stops the form submission if the form is invalid
		if (this.signupForm.invalid || !this.availableUsername) return;

		// This is to show a loading indicator
		this.sendingForm = true;

		const user = {
			firstName: this.signupForm.value.firstName,
			lastName: this.signupForm.value.lastName,
			email: this.signupForm.value.email,
			username: this.signupForm.value.username,
			password: this.signupForm.value.password,
			passwordConfirmation: this.signupForm.value.passwordConfirmation,
			adminCode: this.signupForm.value.adminCode,
			// set image property defaults
			profilePicName: null,
			publicId: null
		};

		// Add image properties to user object if the image has uploaded
		if (this.uploadedImage) {
			user.profilePicName = this.uploadedImage.secure_url;
			user.publicId = this.uploadedImage.public_id;
		}

		this.auth
			.signup(user)
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe(
				res => {
					this.userFacade.signinUser(res);
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

	toggleAdminField() {
		this.showAdminField = !this.showAdminField;
	}

	clearErrorMessage() {
		this.formError = "";
	}

	navigateBack() {
		this.location.back();
	}
}
