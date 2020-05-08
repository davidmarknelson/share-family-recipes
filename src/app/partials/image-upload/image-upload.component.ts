import {
	Component,
	OnInit,
	OnDestroy,
	ChangeDetectorRef,
	Output,
	EventEmitter,
} from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil, concatMap } from "rxjs/operators";
// Services
import { CompressorService } from "../../utilities/services/compressor/compressor.service";
import { CloudinaryService } from "../../utilities/services/cloudinary/cloudinary.service";
import { UploadedImage } from "../../utilities/interfaces/uploadedImage";
import { HttpEventType } from "@angular/common/http";
// Font Awesome
import { faFileUpload } from "@fortawesome/free-solid-svg-icons";
// bulma-toast
import { toast } from "bulma-toast";

@Component({
	selector: "app-image-upload",
	templateUrl: "./image-upload.component.html",
	styleUrls: ["./image-upload.component.scss"],
})
export class ImageUploadComponent implements OnInit, OnDestroy {
	private ngUnsubscribe = new Subject();
	// Font Awesome
	faFileUpload = faFileUpload;
	// ===========================
	@Output() uploadedImage = new EventEmitter<UploadedImage>();
	// used to send data to the parent component to keep the form from submitting
	// while the image is loading to cloudinary
	@Output() isImageLoading = new EventEmitter<boolean>();
	// used to show the loading bar in this template
	isImageSending: boolean = false;
	// this is used to stop the user from submitting the form while the image is deleting
	@Output() isSendingDeleteToken = new EventEmitter<boolean>();
	// this show the spinner on the delete button
	isDeleting: boolean;
	deleteToken: string;
	selectedFile: File;
	selectedFileName: string = "example.jpeg";
	isFileSelected: boolean = false;
	isUploadCompleted: boolean = false;
	imageLoadedAmount: number = 0;
	hasImageErrored: boolean = false;
	imageError: string;

	constructor(
		private compressor: CompressorService,
		private cloudinary: CloudinaryService,
		private changeDetector: ChangeDetectorRef
	) {}

	ngOnInit() {
		this.isImageLoading
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe(res => (this.isImageSending = res));
		this.isSendingDeleteToken
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe(res => (this.isDeleting = res));
	}

	ngOnDestroy() {
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}

	// The picture is first saved to the property selectedFile and selectedFileName.
	onFileSelected(event) {
		// clear errors
		this.imageError = "";
		this.hasImageErrored = false;

		this.isFileSelected = true;
		this.selectedFileName = event.target.files[0].name;
		this.selectedFile = event.target.files[0];

		if (event.target.files[0].type !== "image/jpeg") {
			this.hasImageErrored = true;
			return (this.imageError = "Your picture must be a JPEG image.");
		}
	}

	// The image is then uploaded to cloudinary and the returned information is sent to
	// other components to be used by the database.
	uploadImage() {
		if (this.selectedFile.type !== "image/jpeg") {
			this.hasImageErrored = true;
			return (this.imageError = "Your picture must be a JPEG image.");
		}

		this.isImageLoading.emit(true);

		this.compressor
			.compressImage(this.selectedFile)
			.pipe(
				concatMap(res => this.cloudinary.uploadPic(res, res.name)),
				takeUntil(this.ngUnsubscribe)
			)
			.subscribe(
				event => {
					if (event.type === HttpEventType.UploadProgress) {
						this.imageLoadedAmount = Math.round(
							(event.loaded / event.total) * 100
						);
						this.changeDetector.detectChanges();
					} else if (event.type === HttpEventType.Response) {
						this.isImageLoading.emit(false);
						this.uploadedImage.emit(event.body);
						this.deleteToken = event.body.delete_token;
						this.isUploadCompleted = true;
						this.changeDetector.detectChanges();
					}
				},
				err => {
					this.isImageLoading.emit(false);
					this.hasImageErrored = true;
					this.imageError = "Error uploading your picture.";
					this.changeDetector.detectChanges();
				}
			);
	}

	clearImageErrorMessage() {
		this.imageError = "";
		this.changeDetector.detectChanges();
	}

	resetErrors() {
		this.isFileSelected = false;
		this.hasImageErrored = false;
		this.selectedFileName = "example.jpeg";
		this.selectedFile = null;
		this.imageError = "";
	}

	deleteUploadedFile() {
		// Delete the information from this component.
		if (!this.deleteToken) {
			return this.resetErrors();
		}

		// Delete the information from cloudinary if the user has already uploaded to cloudinary.
		// The delete token is only valid for 10 minutes.
		this.isSendingDeleteToken.emit(true);

		this.cloudinary
			.deleteImageByToken(this.deleteToken)
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe(
				res => {
					toast({
						message: "Image was successfully removed.",
						type: "is-success",
						dismissible: true,
						duration: 5000,
						position: "top-center",
						closeOnClick: true,
						pauseOnHover: true,
					});

					this.uploadedImage.emit(null);
					this.resetErrors();
					this.isSendingDeleteToken.emit(false);
					this.deleteToken = "";
				},
				err => {
					this.isSendingDeleteToken.emit(false);
					this.hasImageErrored = true;
					this.imageError = err.error.message;
				}
			);
	}
}
