import { TestBed } from '@angular/core/testing';

import { CompressorService } from './compressor.service';

describe('CompressorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CompressorService = TestBed.get(CompressorService);
    expect(service).toBeTruthy();
  });

  // I don't know how to test this yet
  xit('compressImage should return a file', () => {
    const service: CompressorService = TestBed.get(CompressorService);

    let mockFile = new File([new Blob], 'image.jpeg', {type: 'image/jpeg'});

    let returnedFile;
    service.compressImage(mockFile).subscribe(res => {
      returnedFile = res;
    });
    expect(returnedFile).toEqual(mockFile)
  });
});
