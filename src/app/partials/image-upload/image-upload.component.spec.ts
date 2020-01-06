import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { ImageUploadComponent } from './image-upload.component';
import { CompressorService } from '../../utilities/services/compressor/compressor.service';
import { ImageUploadModule } from './image-upload.module';
import { CloudinaryService } from '../../utilities/services/cloudinary/cloudinary.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpEventType } from '@angular/common/http';

let fixture: ComponentFixture<ImageUploadComponent>;
let progressBar: DebugElement;
let uploadBtn: DebugElement;
let removeImgBtn: DebugElement;
let errorMsg: DebugElement;
let fileNameSpan: DebugElement;
let uploadingPercentage: DebugElement;
let uploadingComplete: DebugElement;
let closeErrorMsg: DebugElement;

function selectElements() {
  progressBar = fixture.debugElement.query(By.css('progress'));
  uploadBtn = fixture.debugElement.query(By.css('[data-test=upload-btn]'));
  removeImgBtn = fixture.debugElement.query(By.css('[data-test=remove-img-btn]'));
  errorMsg = fixture.debugElement.query(By.css('.notification'));
  fileNameSpan = fixture.debugElement.query(By.css('.file-name'));
  uploadingPercentage = fixture.debugElement.query(By.css('[data-test=uploading-percentage]'));
  uploadingComplete = fixture.debugElement.query(By.css('[data-test=uploading-complete]'));
  closeErrorMsg = fixture.debugElement.query(By.css('.delete'));
}

const jpegFile = {
  target: {
    files: [new File([new Blob], 'image.jpeg', {type: 'image/jpeg'})]
  }
};

const uploadedPicResponse = {
  access_mode: 'public',
  bytes: 730000,
  created_at: '2020-01-03T21:25:52Z',
  etag: '1234',
  format: 'jpg',
  height: 100,
  width: 100,
  original_extension: 'jpeg',
  original_filename: 'IMG_1111',
  placeholder: false,
  public_id: 'sfr_unsigned_dev/asdf.jpeg',
  resource_type: 'image',
  secure_url: 'https://url',
  signature: 'zxcv',
  tags: [],
  type: 'upload',
  url: 'http://url',
  version: 1234,
  delete_token: '1qaz'
}

class MockCompressorService {
  compressImage(file) {
    return of()
  }
}

class MockCloudinaryService {
  uploadPic(file, name) {
    return of()
  }
  deleteImageByToken(deleteToken) {
    return of()
  }
}

describe('ImageUploadComponent', () => {
  let component: ImageUploadComponent;
  let cloudinaryService: CloudinaryService;
  let compressorService: CompressorService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ImageUploadModule, HttpClientTestingModule]
    })
    .overrideComponent(ImageUploadComponent, {
      set: {
        providers: [
          { provide: CompressorService, useClass: MockCompressorService },
          { provide: CompressorService, useClass: MockCompressorService }
        ]
      }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageUploadComponent);
    component = fixture.componentInstance;
    cloudinaryService = fixture.debugElement.injector.get(CloudinaryService);
    compressorService = fixture.debugElement.injector.get(CompressorService);
    fixture.detectChanges();
    selectElements();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initalization', () => {
    it('should not show loading and buttons', () => {
      expect(progressBar).toBeFalsy();
      expect(uploadBtn).toBeFalsy();
      expect(removeImgBtn).toBeFalsy();
      expect(errorMsg).toBeFalsy();
    });
  });

  describe('onFileSelected()', () => {
    it('should show an error if the image uploaded in not jpeg', () => {
      let pngFile = {
        target: {
          files: [new File([new Blob], 'image.png', {type: 'image/png'})]
        }
      };

      component.onFileSelected(pngFile);
      fixture.detectChanges();
      selectElements();

      expect(errorMsg.nativeElement.innerText).toContain('Your picture must be a JPEG image.');
      expect(progressBar).toBeFalsy();
      expect(uploadBtn).toBeFalsy();
      expect(removeImgBtn).toBeTruthy();

      closeErrorMsg.nativeElement.click();
      fixture.detectChanges();
      selectElements();

      expect(removeImgBtn).toBeTruthy();
    });

    it('should assign the file and file name to different parameters', () => {
      component.onFileSelected(jpegFile);
      fixture.detectChanges();
      selectElements();

      expect(errorMsg).toBeFalsy();
      expect(progressBar).toBeFalsy();
      expect(uploadBtn).toBeTruthy();
      expect(component.selectedFile).toEqual(jpegFile.target.files[0]);
      expect(component.selectedFileName).toEqual('image.jpeg');
      expect(fileNameSpan.nativeElement.innerText).toContain('image.jpeg');
    });
  });

  describe('uploadImage()', () => {
    it('should show the progress bar when the file is uploading', () => {
      spyOn(compressorService, 'compressImage');
      spyOn(cloudinaryService, 'uploadPic').and.callFake(() => of());

      component.onFileSelected(jpegFile);
      fixture.detectChanges();
      selectElements();

      uploadBtn.nativeElement.click();
      fixture.detectChanges();
      selectElements();

      expect(progressBar).toBeTruthy();
      expect(uploadingPercentage.nativeElement.innerText).toContain('Uploaded 0%');
    });

    it('should show a success message when the image has uploaded', () => {
      spyOn(compressorService, 'compressImage').and.returnValue(of(jpegFile.target.files[0]));
      spyOn(cloudinaryService, 'uploadPic').and.callFake(() => {
        return of({
          type: HttpEventType.Response,
          body: uploadedPicResponse
        })
      });
      spyOn(component.uploadedImage, 'emit');

      component.onFileSelected(jpegFile);
      fixture.detectChanges();
      selectElements();

      uploadBtn.nativeElement.click();
      fixture.detectChanges();
      selectElements();

      expect(progressBar).toBeFalsy();
      expect(uploadingComplete).toBeTruthy();
      expect(component.uploadedImage.emit).toHaveBeenCalled();
      expect(compressorService.compressImage).toHaveBeenCalled();
      expect(cloudinaryService.uploadPic).toHaveBeenCalled();
    });

    it('should show an error message when there is an error', () => {
      spyOn(compressorService, 'compressImage').and.returnValue(of(jpegFile.target.files[0]));
      spyOn(cloudinaryService, 'uploadPic').and.callFake(() => {
        return throwError({});
      });
      spyOn(component.uploadedImage, 'emit');
      spyOn(component.isImageLoading, 'emit');

      component.onFileSelected(jpegFile);
      fixture.detectChanges();
      selectElements();

      uploadBtn.nativeElement.click();
      fixture.detectChanges();
      selectElements();

      expect(progressBar).toBeFalsy();
      expect(uploadingComplete).toBeFalsy();
      expect(component.uploadedImage.emit).not.toHaveBeenCalled();
      expect(component.isImageLoading.emit).toHaveBeenCalled();
      expect(compressorService.compressImage).toHaveBeenCalled();
      expect(cloudinaryService.uploadPic).toHaveBeenCalled();
      expect(errorMsg.nativeElement.innerText).toContain('Error uploading your picture.');

      closeErrorMsg.nativeElement.click();
      fixture.detectChanges();
      selectElements();

      expect(removeImgBtn).toBeTruthy();
    });
  });

  describe('deleteUploadedFile()', () => {
    it('should remove the image and errors saved to the component when the user has not uploaded the picture', () => {
      component.onFileSelected(jpegFile);
      fixture.detectChanges();
      selectElements();

      spyOn(component, 'resetErrors').and.callThrough();
      spyOn(cloudinaryService, 'deleteImageByToken');

      removeImgBtn.nativeElement.click();
      fixture.detectChanges();
      selectElements();

      expect(component.resetErrors).toHaveBeenCalled();
      expect(cloudinaryService.deleteImageByToken).not.toHaveBeenCalled();
      expect(component.selectedFile).toEqual(null);
      expect(component.selectedFileName).toEqual('example.jpeg');
    });

    it('should remove the image and errors saved to cloudinary', () => {
      spyOn(compressorService, 'compressImage').and.returnValue(of(jpegFile.target.files[0]));
      spyOn(cloudinaryService, 'uploadPic').and.callFake(() => {
        return of({
          type: HttpEventType.Response,
          body: uploadedPicResponse
        })
      });

      // upload file
      component.onFileSelected(jpegFile);
      fixture.detectChanges();
      selectElements();

      // save to cloudinary
      uploadBtn.nativeElement.click();
      fixture.detectChanges();
      selectElements();

      spyOn(component, 'resetErrors').and.callThrough();
      spyOn(cloudinaryService, 'deleteImageByToken').and.callFake(() => of({}));
      spyOn(component.uploadedImage, 'emit');
      spyOn(component.isSendingDeleteToken, 'emit');

      removeImgBtn.nativeElement.click();
      fixture.detectChanges();
      selectElements();

      expect(component.resetErrors).toHaveBeenCalled();
      expect(cloudinaryService.deleteImageByToken).toHaveBeenCalled();
      expect(component.selectedFile).toEqual(null);
      expect(component.selectedFileName).toEqual('example.jpeg');
      expect(component.deleteToken).toEqual('');
      expect(component.uploadedImage.emit).toHaveBeenCalled();
      expect(component.isSendingDeleteToken.emit).toHaveBeenCalled();
    });
  });
});
