import { LoggedInGuard } from './logged-in.guard';

class MockRouter {
  navigate(path) {}
}

describe('LoggedInGuard', () => {
  describe('canActivate', () => {
    let loggedInGuard: LoggedInGuard;
    let authService;
    let router;

    it('should return true for a logged out user', () => {
      authService = { isLoggedIn: () => false };
      router = new MockRouter();
      loggedInGuard = new LoggedInGuard(authService, router);
      expect(loggedInGuard.canActivate()).toEqual(true);
    });

    it('should navigate to home for a logged in user', () => {
      authService = { isLoggedIn: () => true };
      router = new MockRouter();
      loggedInGuard = new LoggedInGuard(authService, router);
      spyOn(router, 'navigate');
      expect(loggedInGuard.canActivate()).toEqual(false);
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
  });
});
