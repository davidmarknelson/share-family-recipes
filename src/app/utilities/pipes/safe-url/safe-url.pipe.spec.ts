import { SafeUrlPipe } from './safe-url.pipe';
import { DomSanitizer } from '@angular/platform-browser';
import { TestBed } from '@angular/core/testing';

describe('SafeUrlPipe', () => {
  let pipe: SafeUrlPipe;
  let sanitizer: DomSanitizer;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SafeUrlPipe]
    });
    
    sanitizer = TestBed.get(DomSanitizer);
    pipe = TestBed.get(SafeUrlPipe);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
});
