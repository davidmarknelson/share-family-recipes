import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EmailVerificationService } from './email-verification.service';

fdescribe('EmailVerificationService', () => {
  let emailService: EmailVerificationService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [EmailVerificationService]
    });
    
    http = TestBed.get(HttpTestingController);
    emailService = TestBed.get(EmailVerificationService);
  });

  it('should be created', () => {
    const service: EmailVerificationService = TestBed.get(EmailVerificationService);
    expect(service).toBeTruthy();
  });

  describe('sendVerificationEmail', () => {
    it('should return a message when the email has successfully been sent', () => {
      const email = 'example@email.com';
      const signupResponse = {
        'message': 'Email has successfully been sent.'
      };
      let response;

      emailService.sendVerificationEmail(email).subscribe(res => {
        response = res;
      });

      http.expectOne('http://localhost:3000/verify/send').flush(signupResponse);
      expect(response).toEqual(signupResponse);
      http.verify();
    });

    it('should return an error message on error', () => {
      const email = 'example@email.com';

      const signupResponse = 'There was an error sending the email.';
      let errorResponse;
    
      emailService.sendVerificationEmail(email).subscribe(res => {}, err => {
        errorResponse = err;
      });
    
      http.expectOne('http://localhost:3000/verify/send')
        .flush({message: signupResponse}, {status: 500, statusText: 'Internal Server Error'});
      expect(errorResponse.error.message).toEqual(signupResponse);
      http.verify();
    });
  });

  describe('verifyEmail', () => {
    it('should return a message when the email has successfully been sent', () => {
      const token = '123456789';
      const signupResponse = {
        'message': 'Your email is now verified.'
      };
      let response;

      emailService.verifyEmail(token).subscribe(res => {
        response = res;
      });

      http.expectOne('http://localhost:3000/verify').flush(signupResponse);
      expect(response).toEqual(signupResponse);
      http.verify();
    });

    it('should return an error message if the token has expired', () => {
      const token = '123456789';

      const signupResponse = 'The token has expired. Please send another verification email.';
      let errorResponse;
    
      emailService.verifyEmail(token).subscribe(res => {}, err => {
        errorResponse = err;
      });
    
      http.expectOne('http://localhost:3000/verify')
        .flush({message: signupResponse}, {status: 404, statusText: 'Not Found'});
      expect(errorResponse.error.message).toEqual(signupResponse);
      http.verify();
    });

    it('should return an error message on error', () => {
      const token = '123456789';

      const signupResponse = 'There was an error verifying your email.';
      let errorResponse;
    
      emailService.verifyEmail(token).subscribe(res => {}, err => {
        errorResponse = err;
      });
    
      http.expectOne('http://localhost:3000/verify')
        .flush({message: signupResponse}, {status: 500, statusText: 'Internal Server Error'});
      expect(errorResponse.error.message).toEqual(signupResponse);
      http.verify();
    });
  });
});
