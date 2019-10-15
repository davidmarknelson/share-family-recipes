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

  describe('sendVerificationEmail', () => {
    it('should return a message when the email has successfully been sent', () => {
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
});
