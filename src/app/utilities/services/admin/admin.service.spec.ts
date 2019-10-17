import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdminService } from './admin.service';

const userArrayResponse = {
  "count": 1,
  "rows": [
    {
      "id": 1,
      "username": "johndoe",
      "profilePic": null,
      "firstName": "John",
      "lastName": "Doe",
      "email": "test@email.com",
      "isVerified": false,
      "isAdmin": true,
      "createdAt": "2019-10-08T07:45:48.214Z",
      "meals": [
        { "id": 1 }
      ]
    }
  ]
}

describe('AdminService', () => {
  let adminService: AdminService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [AdminService]
    });

    http = TestBed.get(HttpTestingController);
    adminService = TestBed.get(AdminService);
  });

  it('should be created', () => {
    const service: AdminService = TestBed.get(AdminService);
    expect(service).toBeTruthy();
  });

  describe('formatDate', () => {
    it('should return a date in Mon Day, Year format', () => {
      let date = adminService.formatDate('2019-10-08T07:45:48.214Z');
      expect(date).toEqual('Oct 08, 2019');
    });
  });

  // =================================
  // Get users by signed up date
  // =================================
  describe('getUsersByNewest', () => {
    it('should return an array of users', () => {
      let response;
      adminService.getUsersByNewest(0, 10).subscribe(res => {
        response = res;
      });

      http.expectOne('http://localhost:3000/admin/newusers?offset=0&limit=10')
        .flush(userArrayResponse);
      expect(response).toEqual(userArrayResponse);
      http.verify();
    });

    it('should return a 403 status if the user is not an admin', () => {
      let signupResponse = {
        "message": "You do not have permission to access this service."
      };

      let errorResponse;
      adminService.getUsersByNewest(0, 10).subscribe(res => {}, err => {
        errorResponse = err.error;
      });

      http.expectOne('http://localhost:3000/admin/newusers?offset=0&limit=10')
        .flush(signupResponse, {status: 403, statusText: 'Forbidden'});
      expect(errorResponse).toEqual(signupResponse);
      http.verify();
    });
  });

  describe('getUsersByOldest', () => {
    it('should return an array of users', () => {
      let response;
      adminService.getUsersByOldest(0, 10).subscribe(res => {
        response = res;
      });

      http.expectOne('http://localhost:3000/admin/oldusers?offset=0&limit=10')
        .flush(userArrayResponse);
      expect(response).toEqual(userArrayResponse);
      http.verify();
    });

    it('should return a 403 status if the user is not an admin', () => {
      let signupResponse = {
        "message": "You do not have permission to access this service."
      };

      let errorResponse;
      adminService.getUsersByOldest(0, 10).subscribe(res => {}, err => {
        errorResponse = err.error;
      });

      http.expectOne('http://localhost:3000/admin/oldusers?offset=0&limit=10')
        .flush(signupResponse, {status: 403, statusText: 'Forbidden'});
      expect(errorResponse).toEqual(signupResponse);
      http.verify();
    });
  });

  // =================================
  // Get users alphabetically by username
  // =================================
  describe('getUsersByFirstNameAtoZ', () => {
    it('should return an array of users', () => {
      let response;
      adminService.getUsersByFirstNameAtoZ(0, 10).subscribe(res => {
        response = res;
      });

      http.expectOne('http://localhost:3000/admin/firstname-a-z?offset=0&limit=10')
        .flush(userArrayResponse);
      expect(response).toEqual(userArrayResponse);
      http.verify();
    });

    it('should return a 403 status if the user is not an admin', () => {
      let signupResponse = {
        "message": "You do not have permission to access this service."
      };

      let errorResponse;
      adminService.getUsersByFirstNameAtoZ(0, 10).subscribe(res => {}, err => {
        errorResponse = err.error;
      });

      http.expectOne('http://localhost:3000/admin/firstname-a-z?offset=0&limit=10')
        .flush(signupResponse, {status: 403, statusText: 'Forbidden'});
      expect(errorResponse).toEqual(signupResponse);
      http.verify();
    });
  });

  // =================================
  // Get users alphabetically by first name
  // =================================
  describe('getUsersByFirstNameZtoA', () => {
    it('should return an array of users', () => {
      let response;
      adminService.getUsersByFirstNameZtoA(0, 10).subscribe(res => {
        response = res;
      });

      http.expectOne('http://localhost:3000/admin/firstname-z-a?offset=0&limit=10')
        .flush(userArrayResponse);
      expect(response).toEqual(userArrayResponse);
      http.verify();
    });

    it('should return a 403 status if the user is not an admin', () => {
      let signupResponse = {
        "message": "You do not have permission to access this service."
      };

      let errorResponse;
      adminService.getUsersByFirstNameZtoA(0, 10).subscribe(res => {}, err => {
        errorResponse = err.error;
      });

      http.expectOne('http://localhost:3000/admin/firstname-z-a?offset=0&limit=10')
        .flush(signupResponse, {status: 403, statusText: 'Forbidden'});
      expect(errorResponse).toEqual(signupResponse);
      http.verify();
    });
  });

  // =================================
  // Get users alphabetically by last name
  // =================================
  describe('getUsersByLastNameZtoA', () => {
    it('should return an array of users', () => {
      let response;
      adminService.getUsersByLastNameZtoA(0, 10).subscribe(res => {
        response = res;
      });

      http.expectOne('http://localhost:3000/admin/lastname-z-a?offset=0&limit=10')
        .flush(userArrayResponse);
      expect(response).toEqual(userArrayResponse);
      http.verify();
    });

    it('should return a 403 status if the user is not an admin', () => {
      let signupResponse = {
        "message": "You do not have permission to access this service."
      };

      let errorResponse;
      adminService.getUsersByLastNameZtoA(0, 10).subscribe(res => {}, err => {
        errorResponse = err.error;
      });

      http.expectOne('http://localhost:3000/admin/lastname-z-a?offset=0&limit=10')
        .flush(signupResponse, {status: 403, statusText: 'Forbidden'});
      expect(errorResponse).toEqual(signupResponse);
      http.verify();
    });
  });
});
