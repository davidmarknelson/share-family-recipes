import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PasswordService } from './password.service';

describe('PasswordService', () => {
  let http: HttpTestingController;
  let passwordService: PasswordService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [PasswordService]
    });
    
    http = TestBed.get(HttpTestingController);
    passwordService = TestBed.get(PasswordService);
  });

  it('should be created', () => {
    const service: PasswordService = TestBed.get(PasswordService);
    expect(service).toBeTruthy();
  });

  describe('updateUser', () => {
    it('should return a message when the password has successfully been updated', () => {
      const passwords = {
        'password': 'password',
        'passwordConfirmation': 'password'
      };
      const updateResponse = {
        'message': 'Your password was successfully updated.'
      };
      let response;

      passwordService.updatePassword(passwords).subscribe(res => {
        response = res;
      });

      http.expectOne('http://localhost:3000/password/update').flush(updateResponse);
      expect(response).toEqual(updateResponse);
      http.verify();
    });

    it('should return an error message when the passwords do not match', () => {
      const passwords = {
        'password': 'password',
        'passwordConfirmation': 'notMatch'
      };

      const updateResponse = 'Passwords do not match.';
      let errorResponse;
    
      passwordService.updatePassword(passwords).subscribe(res => {}, err => {
        errorResponse = err;
      });
    
      http.expectOne('http://localhost:3000/password/update')
        .flush({message: updateResponse}, {status: 400, statusText: 'Bad Request'});
      expect(errorResponse.error.message).toEqual(updateResponse);
      http.verify();
    });

    it('should return an error message on error', () => {
      const passwords = {
        'password': 'password',
        'passwordConfirmation': 'password'
      };

      const updateResponse = 'There was an error updating your password.';
      let errorResponse;
    
      passwordService.updatePassword(passwords).subscribe(res => {}, err => {
        errorResponse = err;
      });
    
      http.expectOne('http://localhost:3000/password/update')
        .flush({message: updateResponse}, {status: 500, statusText: 'Server Error'});
      expect(errorResponse.error.message).toEqual(updateResponse);
      http.verify();
    });
  });

  describe('sendResetEmail', () => {
    it('should return a message when the email has successfully been sent', () => {
      const email = { 'email': 'test@email.com' };
      const emailResponse = {
        'message': 'An email has been sent to test@email.com with further instructions.'
      };
      let response;

      passwordService.sendResetEmail(email).subscribe(res => {
        response = res;
      });

      http.expectOne('http://localhost:3000/password/send').flush(emailResponse);
      expect(response).toEqual(emailResponse);
      http.verify();
    });

    it('should return an error message when the email does not exist', () => {
      const email = { 'email': 'test@email.com' };

      const emailResponse = 'No account with that email address exists.';
      let errorResponse;
    
      passwordService.sendResetEmail(email).subscribe(res => {}, err => {
        errorResponse = err;
      });
    
      http.expectOne('http://localhost:3000/password/send')
        .flush({message: emailResponse}, {status: 404, statusText: 'Bad Request'});
      expect(errorResponse.error.message).toEqual(emailResponse);
      http.verify();
    });
  });

  describe('resetPassword', () => {
    it('should return a message when the password has successfully been reset', () => {
      const credentials = {
        'password': 'password',
        'passwordConfirmation': 'password',
        'token': '1234567890'
      };
      const resetResponse = {
        'message': 'Your password was successfully reset. Please log in with your new password.'
      };
      let response;

      passwordService.resetPassword(credentials).subscribe(res => {
        response = res;
      });

      http.expectOne('http://localhost:3000/password/reset').flush(resetResponse);
      expect(response).toEqual(resetResponse);
      http.verify();
    });

    it('should return an error message if the reset token does not exist', () => {
      const credentials = {
        'password': 'password',
        'passwordConfirmation': 'password',
        'token': '1234567890'
      };

      const resetResponse = 'Password reset token is invalid or has expired.';
      let errorResponse;
    
      passwordService.resetPassword(credentials).subscribe(res => {}, err => {
        errorResponse = err;
      });
    
      http.expectOne('http://localhost:3000/password/reset')
        .flush({message: resetResponse}, {status: 404, statusText: 'Not Found'});
      expect(errorResponse.error.message).toEqual(resetResponse);
      http.verify();
    });

    it('should return an error message if the passwords do not match', () => {
      const credentials = {
        'password': 'password',
        'passwordConfirmation': 'password',
        'token': '1234567890'
      };

      const resetResponse = 'Passwords do not match.';
      let errorResponse;
    
      passwordService.resetPassword(credentials).subscribe(res => {}, err => {
        errorResponse = err;
      });
    
      http.expectOne('http://localhost:3000/password/reset')
        .flush({message: resetResponse}, {status: 400, statusText: 'Bad Request'});
      expect(errorResponse.error.message).toEqual(resetResponse);
      http.verify();
    });

    it('should return an error message on error', () => {
      const credentials = {
        'password': 'password',
        'passwordConfirmation': 'password',
        'token': '1234567890'
      };

      const resetResponse = 'No account with that email address exists.';
      let errorResponse;
    
      passwordService.resetPassword(credentials).subscribe(res => {}, err => {
        errorResponse = err;
      });
    
      http.expectOne('http://localhost:3000/password/reset')
        .flush({message: resetResponse}, {status: 500, statusText: 'Server Error'});
      expect(errorResponse.error.message).toEqual(resetResponse);
      http.verify();
    });
  });
});
