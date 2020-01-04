import { Component, OnInit, OnDestroy, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, concatMap } from 'rxjs/operators';
// Services
import { CompressorService } from '../../utilities/services/compressor/compressor.service';
import { CloudinaryService } from '../../utilities/services/cloudinary/cloudinary.service';
import { UploadedImage } from '../../utilities/services/cloudinary/uploadedImage';
import { HttpEventType } from '@angular/common/http';
// Font Awesome
import { faFileUpload } from '@fortawesome/free-solid-svg-icons';
// bulma-toast
import { toast } from 'bulma-toast';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
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
  deleteToken: string;
  selectedFileName: string = 'example.jpeg';
  isFileSelected: boolean = false;
  isUploadCompleted: boolean = false;
  isSendingDeleteToken: boolean = false;
  imageLoadedAmount: number = 0;
  hasImageErrored: boolean = false;
  imageError: string;

  constructor(
    private compressor: CompressorService,
    private cloudinary: CloudinaryService,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.isImageLoading
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => this.isImageSending = res);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onFileSelected(event) {
    // clear errors
    this.imageError = '';
    this.hasImageErrored = false;

    this.isFileSelected = true;
    this.selectedFileName = event.target.files[0].name;

    if (event.target.files[0].type !== 'image/jpeg') {
      this.hasImageErrored = true;
      return this.imageError = 'Your picture must be a JPEG image.';
    }

    this.isImageLoading.emit(true);

    this.compressor.compressImage(event.target.files[0]).pipe(
      concatMap(res => this.cloudinary.uploadPic(res, res.name)),
      takeUntil(this.ngUnsubscribe)
    ).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.imageLoadedAmount = Math.round(event.loaded / event.total * 100);
        this.changeDetector.detectChanges();
      } else if (event.type === HttpEventType.Response) {
        this.isImageLoading.emit(false);
        this.uploadedImage.emit(event.body);
        this.deleteToken = event.body.delete_token;
        this.isUploadCompleted = true;
        this.changeDetector.detectChanges();
      }
    }, err => {
      this.isImageLoading.emit(false);
      this.hasImageErrored = true;

      this.imageError = 'Error uploading your picture.'
    });
  }

  clearImageErrorMessage() {
    this.imageError = '';
  }

  resetErrors() {
    this.isFileSelected = false;
    this.hasImageErrored = false;
    this.selectedFileName = 'example.jpeg';
    this.imageError = '';
  }

  deleteUploadedFile() {
    if (!this.deleteToken) {
      this.resetErrors();
    };

    this.isSendingDeleteToken = true;
    
    this.cloudinary.deleteImageByToken(this.deleteToken).pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe(res => {
      toast({
        message: 'Image was successfully removed.',
        type: "is-success",
        dismissible: true,
        duration: 5000,
        position: "top-center",
        closeOnClick: true,
        pauseOnHover: true
      });

      this.resetErrors();
      this.isSendingDeleteToken = false;
    }, err => {
      this.isSendingDeleteToken = false;
      this.hasImageErrored = true;
      this.imageError = err.error.message
    });
  }
}
