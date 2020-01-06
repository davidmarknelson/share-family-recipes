import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';

import { CloudinaryService } from './cloudinary.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UploadedImage } from './uploadedImage';

let uploadedImage: UploadedImage = {
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

describe('CloudinaryService', () => {
  let http: HttpTestingController;
  let cloudinaryService: CloudinaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    
    http = TestBed.get(HttpTestingController);
    cloudinaryService = TestBed.get(CloudinaryService);
  });

  it('should be created', () => {
    expect(cloudinaryService).toBeTruthy();
  });

  describe('uploadPic', () => {
    it('should return an object on success', () => {
      const pic = new File([new Blob], 'image.jpeg', {type: 'image/jpeg'});
      let response;

      cloudinaryService.uploadPic(pic, pic.name).subscribe(res => {
        response = res;
      });

      http.expectOne('https://api.cloudinary.com/v1_1/dcwjkxleo/image/upload').flush(uploadedImage);
      expect(response.body).toEqual(uploadedImage);
      http.verify();
    });

    it('should return an error object on error', () => {
      const pic = new File([new Blob], 'image.jpeg', {type: 'image/jpeg'});
      let errorMessage = {message: 'invalid token'};
      let errorResponse;

      cloudinaryService.uploadPic(pic, pic.name)
        .subscribe(res => {}, err => errorResponse = err.error);

      http.expectOne('https://api.cloudinary.com/v1_1/dcwjkxleo/image/upload')
        .flush(errorMessage, {status: 400, statusText: 'Bad Request'});
      expect(errorResponse).toEqual(errorMessage);
      http.verify();
    });
  });
  
  describe('deleteImageByToken', () => {
    it('should return an object on success', () => {
      let successMessage = { result: 'ok'};
      let response;

      cloudinaryService.deleteImageByToken('token').subscribe(res => {
        response = res;
      });

      http.expectOne('https://api.cloudinary.com/v1_1/dcwjkxleo/delete_by_token').flush(successMessage);
      expect(response).toEqual(successMessage);
      http.verify();
    });

    it('should return an error object on error', () => {
      let errorMessage = {message: 'error'};
      let errorResponse;

      cloudinaryService.deleteImageByToken('token')
        .subscribe(res => {}, err => errorResponse = err.error);

      http.expectOne('https://api.cloudinary.com/v1_1/dcwjkxleo/delete_by_token')
        .flush(errorMessage, {status: 400, statusText: 'Bad Request'});
      expect(errorResponse).toEqual(errorMessage);
      http.verify();
    });
  });
});
