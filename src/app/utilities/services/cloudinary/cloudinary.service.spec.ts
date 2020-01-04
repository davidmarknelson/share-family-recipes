import { TestBed } from '@angular/core/testing';

import { CloudinaryService } from './cloudinary.service';

describe('CloudinaryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CloudinaryService = TestBed.get(CloudinaryService);
    expect(service).toBeTruthy();
  });
});
