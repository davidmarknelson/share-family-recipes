import { TestBed, async, inject } from '@angular/core/testing';

import { AdminGuard } from './admin.guard';

class MockRouter {
  navigate(path) {}
}

describe('AdminGuard', () => {
  let adminGuard: AdminGuard;
  let authService;
  let router;

  describe('canActivate', () => {
    it('should return true for an admin user', () => {
      authService = { currentUser: () => { 
        return {
          id: 1,
          isAdmin: true,
          username: 'johndoe',
          originalUsername: 'johndoe'
        }
      }};
      router = new MockRouter();
      adminGuard = new AdminGuard(authService, router);
      expect(adminGuard.canActivate()).toEqual(true);
    });
  
    it('should navigate to the profile for a user who is not an admin', () => {
      authService = { currentUser: () => { 
        return {
          id: 1,
          isAdmin: false,
          username: 'johndoe',
          originalUsername: 'johndoe'
        }
      }};
      router = new MockRouter();
      adminGuard = new AdminGuard(authService, router);
      spyOn(router, 'navigate');
      expect(adminGuard.canActivate()).toEqual(false);
      expect(router.navigate).toHaveBeenCalledWith(['/profile']);
    });
  });
});
