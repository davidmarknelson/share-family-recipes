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
      spyOn(authService.loggedIn, 'emit');

      http.expectOne('http://localhost:3000/user/signup').flush(signupResponse);
      expect(response).toEqual(signupResponse);
      expect(localStorage.getItem('authToken')).toEqual('s3cr3tt0ken');
      expect(authService.loggedIn.emit).toHaveBeenCalled();
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
      spyOn(authService.loggedIn, 'emit');

      http.expectOne('http://localhost:3000/user/login').flush(loginResponse);
      expect(response).toEqual(loginResponse);
      expect(localStorage.getItem('authToken')).toEqual('s3cr3tt0ken');
      expect(authService.loggedIn.emit).toHaveBeenCalled();
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

  describe('isLoggedIn', () => {
    it('should return true if the user is logged in', () => {
      localStorage.setItem('authToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' + 
        'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.' + 
        'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c');
      expect(authService.isLoggedIn()).toEqual(true);
    });

    it('should return false if the user is not logged in', () => {
      localStorage.removeItem('authToken');
      expect(authService.isLoggedIn()).toEqual(false);
    });
  });

  describe('renewToken', () => {
    it('should return a jwt when given a valid token', () => {
      let signupResponse = { 'jwt': 's3cr3tt0ken' };

      let response;
      authService.renewToken().subscribe(res => {
        response = res;
      });

      http.expectOne('http://localhost:3000/user/renew').flush(signupResponse);
      expect(response).toEqual(signupResponse);
      expect(localStorage.getItem('authToken')).toEqual('s3cr3tt0ken');
      http.verify();
    });
  });

  describe('getProfile', () => {
    it('should return a jwt when given a valid token', () => {
      let signupResponse = {
        'id': 1,
        'username': 'johndoe',
        'originalUsername': 'johndoe',
        'firstName': 'John',
        'lastName': 'Doe',
        'email': 'example@email.com',
        'profilePic': null,
        'isAdmin': false,
        'isVerified': true,
        'createdAt': '2019-10-08T07:45:48.214Z',
        'updatedAt': '2019-10-08T07:45:48.214Z'
      };

      let response;
      authService.getProfile().subscribe(res => {
        response = res;
      });

      http.expectOne('http://localhost:3000/user/profile').flush(signupResponse);
      expect(response).toEqual(signupResponse);
      http.verify();
    });

    describe('formatDate', () => {
      it('should return a date in Mon Day, Year format', () => {
        let date = authService.formatDate('2019-10-08T07:45:48.214Z');
        expect(date).toEqual('Oct 08, 2019');
      });
    });
  });

  describe('currentUser', () => {
    it('should return a user object with a valid token', () => {
      spyOn(localStorage, 'getItem').and.callFake(() => 's3cr3tt0ken' );
      spyOn(jwtHelper, 'decodeToken').and.callFake(() => {
        return {
          exp: 1517847480,
          iat: 1517840280,
          username: 'username',
          originalUsername: 'username',
          isAdmin: true,
          id: 1
        };
      });
      const res = authService.currentUser();
      expect(localStorage.getItem).toHaveBeenCalled();
      expect(res.username).toBeDefined();
      expect(res.id).toBeDefined();
    });
  });

  describe('logout', () => {
    it('should clear the token from local storage', () => {
      spyOn(authService.loggedIn, 'emit');
      localStorage.setItem('authToken', 's3cr3tt0ken');
      expect(localStorage.getItem('authToken')).toEqual('s3cr3tt0ken');
      authService.logout();
      expect(localStorage.getItem('authToken')).toBeFalsy();
      expect(authService.loggedIn.emit).toHaveBeenCalledWith(false);
    });
  });

  describe('updateUser', () => {
    it('should return a message when the user is updated', () => {
      let user = {
        firstName: 'Joe'
      }
      let signupResponse = {
        'message': 'User successfully updated.'
      };

      let response;
      authService.updateUser(user, null).subscribe(res => {
        response = res;
      });

      http.expectOne('http://localhost:3000/user/update').flush(signupResponse);
      expect(response).toEqual(signupResponse);
      http.verify();
    });

    it('should return an error when email is already being used', () => {
      const user = {
        email: 'example@email.com'
      };

      const updateResponse = 'This email account is already in use.';
      let errorResponse;

      authService.updateUser(user, null).subscribe(res => {}, err => {
        errorResponse = err;
      });

      http.expectOne('http://localhost:3000/user/update').flush({message: updateResponse}, {status: 400, statusText: 'Bad Request'});
      expect(errorResponse.error.message).toEqual(updateResponse);
      http.verify();
    });
  });

  describe('deleteUser', () => {
    it('should return a message when the user is deleted', () => {
      let signupResponse = {
        'message': 'User successfully deleted.'
      };

      let response;
      authService.deleteUser().subscribe(res => {
        response = res;
      });

      http.expectOne('http://localhost:3000/user/delete').flush(signupResponse);
      expect(response).toEqual(signupResponse);
      http.verify();
    });

    it('should return an error on error', () => {
      const updateResponse = 'There was an error deleting your profile.';
      let errorResponse;

      authService.deleteUser().subscribe(res => {}, err => {
        errorResponse = err;
      });

      http.expectOne('http://localhost:3000/user/delete').flush({message: updateResponse}, {status: 500, statusText: 'Server Error'});
      expect(errorResponse.error.message).toEqual(updateResponse);
      http.verify();
    });
  });
});
