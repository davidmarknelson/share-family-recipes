import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { JwtModule, JwtHelperService } from '@auth0/angular-jwt';

function tokenGetter() {
  return localStorage.getItem('authToken');
}

function testErrors(key, value, response, authService, http) {
  let user = { 
    firstName: 'John',
    lastName: 'Doe',
    username: 'myUser',
    email: 'example@email.com', 
    password: 'password',
    passwordConfirmation: 'password'
  };

  user[key] = value;

  const profilePic = null;
  const signupResponse = response;
  let errorResponse;

  authService.signup(user, profilePic).subscribe(res => {}, err => {
    errorResponse = err;
  });

  http.expectOne('http://localhost:3000/user/signup')
    .flush({message: signupResponse}, {status: 400, statusText: 'Bad Request'});
  expect(errorResponse.error.message).toEqual(signupResponse);
  http.verify();
}

describe('AuthService', () => {
  let authService: AuthService;
  let http: HttpTestingController;
  let jwtHelper: JwtHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        JwtModule.forRoot({
          config: {
            tokenGetter: tokenGetter
          }
        })
      ],
      providers: [AuthService]
    });
    
    http = TestBed.get(HttpTestingController);
    authService = TestBed.get(AuthService);
    jwtHelper = TestBed.get(JwtHelperService);
  });

  afterEach(() => {
    localStorage.removeItem('authToken');
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  describe('signup', () => {
    it('should return a jwt with a valid user details', () => {
      const user = { 
        firstName: 'John',
        lastName: 'Doe',
        username: 'myUser',
        email: 'example@email.com', 
        password: 'password',
        passwordConfirmation: 'password'
      };
      const profilePic = null;
      const signupResponse = {
        'jwt': 's3cr3tt0ken'
      };
      let response;

      authService.signup(user, profilePic).subscribe(res => {
        response = res;
      });

      http.expectOne('http://localhost:3000/user/signup').flush(signupResponse);
      expect(response).toEqual(signupResponse);
      expect(localStorage.getItem('authToken')).toEqual('s3cr3tt0ken');
      http.verify();
    });

    it('should return an error when invalid credentials are sent', () => {
      // Username is too short
      testErrors('username', 'User', 'Username must be between 5 and 15 characters.', authService, http);
      // Username is too long
      testErrors('username', 'UserNameIsWayTooLong', 'Username must be between 5 and 15 characters.', authService, http);
      // Username shouldn't have a space
      testErrors('username', 'my User', 'Username must not include a space.', authService, http);
      // Username is taken
      testErrors('username', 'myUser', 'This username is already taken.', authService, http);
      // Email is in use
      testErrors('email', 'example@email.com', 'This email account is already in use.', authService, http);
      // Passwords don't match
      testErrors('passwordConfirmation', 'notmatch', 'Passwords do not match.', authService, http);
      // Password is too short
      testErrors('password', 'pass', 'Password must be at least 8 characters long.', authService, http);
    });

    it('should return an error when the profile picture image is not a jpeg', () => {
      const user = { 
        firstName: 'John',
        lastName: 'Doe',
        username: 'myUser',
        email: 'example@email.com', 
        password: 'password',
        passwordConfirmation: 'password'
      };
      let blob = new Blob([""], { type: 'image/png' });
      blob["lastModifiedDate"] = "";
      blob["name"] = "test.png";
      const profilePic = <File>blob;
      
      const signupResponse = 'Please upload a JPEG image.';
      let errorResponse;

      authService.signup(user, profilePic).subscribe(res => {}, err => {
        errorResponse = err;
      });

      http.expectOne('http://localhost:3000/user/signup')
        .flush({message: signupResponse}, {status: 400, statusText: 'Bad Request'});
      expect(errorResponse.error.message).toEqual(signupResponse);
      http.verify();
    });
  });

  describe('checkUsernameAvailability', () => {
    it('should return a 204 status if a username is not already used', () => {
      let signupResponse = null;

      let response;
      authService.checkUsernameAvailability('myUser').subscribe(res => {
        response = res;
      });

      http.expectOne('http://localhost:3000/user/available-username?username=myUser')
        .flush(signupResponse, {status: 204, statusText: 'No Content'});
      expect(response).toEqual(signupResponse);
      http.verify();
    });

    it('should return a 400 status if a username is already used', () => {
      let signupResponse = null;

      let errorResponse;
      authService.checkUsernameAvailability('myUser').subscribe(res => {}, err => {
        errorResponse = err.error;
      });

      http.expectOne('http://localhost:3000/user/available-username?username=myUser')
        .flush(signupResponse, {status: 400, statusText: 'Bad Request'});
      expect(errorResponse).toEqual(signupResponse);
      http.verify();
    });
  });

  describe('login', () => {
    it('should return a jwt with valid credentials', () => {
      const user = {
        email: 'example@email.com', 
        password: 'password'
      };

      const loginResponse = {
        'jwt': 's3cr3tt0ken'
      };
      let response;

      authService.login(user).subscribe(res => {
        response = res;
      });

      http.expectOne('http://localhost:3000/user/login').flush(loginResponse);
      expect(response).toEqual(loginResponse);
      expect(localStorage.getItem('authToken')).toEqual('s3cr3tt0ken');
      http.verify();
    });

    it('should return an error when the password does not match the email or the email does not exist in the database', () => {
      const user = {
        email: 'example@email.com', 
        password: 'wrongPassword'
      };

      const loginResponse = 'The login information was incorrect.';
      let errorResponse;

      authService.login(user).subscribe(res => {}, err => {
        errorResponse = err;
      });

      http.expectOne('http://localhost:3000/user/login').flush({message: loginResponse}, {status: 400, statusText: 'Bad Request'});
      expect(errorResponse.error.message).toEqual(loginResponse);
      expect(localStorage.getItem('authToken')).toBeFalsy();
      http.verify();
    });
  });
});
