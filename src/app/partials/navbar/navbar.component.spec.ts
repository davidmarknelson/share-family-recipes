import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../utilities/services/auth/auth.service';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { AppModule } from '../../app.module';
import { ChangeDetectorRef, DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { SearchesService } from '../../utilities/services/searches/searches.service';

let fixture: ComponentFixture<NavbarComponent>;
let logoutBtn: DebugElement;
let loginBtn: DebugElement;
let signupBtn: DebugElement;
let navbarBrandBtn: DebugElement;
let createBtn: DebugElement;
let recipesBtn: DebugElement;
let searchBarBtn: DebugElement;
let searchContainer: DebugElement;
let searchInput: DebugElement;
let searchSubmitBtn: DebugElement;
let searchItemsContainer: DebugElement;
let searchItems;

function selectElements() {
  logoutBtn = fixture.debugElement.query(By.css('[data-test=navbar-logout]'));
  loginBtn = fixture.debugElement.query(By.css('[data-test=navbar-login]'));
  signupBtn = fixture.debugElement.query(By.css('[data-test=navbar-signup]'));
  navbarBrandBtn = fixture.debugElement.query(By.css('[data-test=navbar-brand]'));
  createBtn = fixture.debugElement.query(By.css('[data-test=navbar-create]'));
  recipesBtn = fixture.debugElement.query(By.css('[data-test=navbar-recipes]'));
  searchBarBtn = fixture.debugElement.query(By.css('[data-test=seachBarBtn]'));
  searchContainer = fixture.debugElement.query(By.css('.search__container'));
  searchInput = fixture.debugElement.query(By.css('#name'));
  searchSubmitBtn = fixture.debugElement.query(By.css('[type=submit]'));
  searchItemsContainer = fixture.debugElement.query(By.css('.search__items-container'));
  searchItems = fixture.debugElement.queryAll(By.css('.search__items'));
}

const user = {
  id: 1,
  isAdmin: true,
  username: 'johndoe',
  savedRecipes: []
}

const recipes = [
  {
    id: 1,
    name: 'Eggs'
  },
  {
    id: 2,
    name: 'Eggs and Rice'
  }
]

class MockRouter {
  navigate(path) {}
  navigateByUrl(path) {}
}

class MockChangeDetectorRef {
  detectChanges() {}
}

class MockAuthService {
  loggedIn = of();
  logout = jasmine.createSpy('logout');
  isLoggedIn() {}
  renewToken() {
    return of()
  }
  currentUser() {
    return of()
  }
}

class MockSearchesService {
  recipesByName(name, limit) {
    return of()
  }
}

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let authService: AuthService;
  let router: Router;
  let changeDetectorRef: ChangeDetectorRef;
  let searchesService: SearchesService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule, RouterTestingModule]
    })
    .overrideComponent(NavbarComponent, {
      set: {
        providers: [
          { provide: AuthService, useClass: MockAuthService },
          { provide: ChangeDetectorRef, useClass: MockChangeDetectorRef },
          { provide: SearchesService, useClass: MockSearchesService }
        ]
      }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    authService = fixture.debugElement.injector.get(AuthService);
    changeDetectorRef = fixture.debugElement.injector.get(ChangeDetectorRef);
    router = fixture.debugElement.injector.get(Router);
    searchesService = fixture.debugElement.injector.get(SearchesService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('with a user who is logged in', () => {
    beforeEach(() => {
      authService.isLoggedIn = jasmine.createSpy('isLoggedIn').and.returnValue(true);
      spyOn(component, 'renewToken').and.callFake(() => authService.renewToken());
      spyOn(authService, 'renewToken');
      fixture.detectChanges();
      selectElements();
    });

    it('should initialize to see if a user is logged in', () => {
      expect(authService.isLoggedIn).toHaveBeenCalled();
      expect(component.isLoggedIn).toEqual(true);
      expect(component.renewToken).toHaveBeenCalled();
      expect(authService.renewToken).toHaveBeenCalled();
    });

    it('should navigate to the home page when logout is clicked', () => {
      spyOn(router, 'navigate');
      logoutBtn.nativeElement.click();
      fixture.detectChanges();
      expect(authService.logout).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should have a link to logout visible and not login and signup', () => {
      expect(logoutBtn).toBeTruthy();
      expect(loginBtn).toBeFalsy();
      expect(signupBtn).toBeFalsy();
    });
  });

  describe('with a user who is not logged in', () => {
    beforeEach(() => {
      authService.isLoggedIn = jasmine.createSpy('isLoggedIn').and.returnValue(false);
      spyOn(component, 'renewToken');
      spyOn(authService, 'renewToken');
      fixture.detectChanges();
      selectElements();
    });

    it('should initialize to see if a user is logged in', () => {
      expect(authService.isLoggedIn).toHaveBeenCalled();
      expect(component.isLoggedIn).toEqual(false);
      expect(component.renewToken).toHaveBeenCalled();
      expect(authService.renewToken).not.toHaveBeenCalled();
    });

    it('should have the correct link on different buttons', () => {
      expect(navbarBrandBtn.attributes.routerLink).toEqual('/');
      expect(recipesBtn.attributes.routerLink).toEqual('/recipes');
      expect(createBtn.attributes.routerLink).toEqual('/create');
      expect(loginBtn.attributes.routerLink).toEqual('/login');
      expect(signupBtn.attributes.routerLink).toEqual('/signup');
      expect(logoutBtn).toBeFalsy();
    });
  });

  describe('search bar', () => {
    beforeEach(() => {
      fixture.detectChanges();
      selectElements();
    });

    it('should initialize with the search bar closed', () => {
      expect(searchBarBtn.attributes['data-tooltip']).toEqual('Open search bar');
      expect(searchContainer).toBeFalsy();
      expect(searchInput).toBeFalsy();
      expect(searchItemsContainer).toBeFalsy();
      expect(searchItems.length).toEqual(0);
    });

    it('should open when clicking on the open search bar button', () => {
      searchBarBtn.nativeElement.click();
      fixture.detectChanges();
      selectElements();

      expect(searchContainer).toBeTruthy();
      expect(searchInput).toBeTruthy();

      expect(searchItemsContainer).toBeFalsy();
      expect(searchItems.length).toEqual(0);
    });

    it('should close when clicking on the open search bar button', () => {
      searchBarBtn.nativeElement.click();
      fixture.detectChanges();
      selectElements();

      expect(searchContainer).toBeTruthy();
      expect(searchInput).toBeTruthy();

      expect(searchItemsContainer).toBeFalsy();
      expect(searchItems.length).toEqual(0);

      searchBarBtn.nativeElement.click();
      fixture.detectChanges();
      selectElements();

      expect(searchContainer).toBeFalsy();
      expect(searchInput).toBeFalsy();

      expect(searchItemsContainer).toBeFalsy();
      expect(searchItems.length).toEqual(0);
    });

    it('should show a list of recipes when the user types a name into the input', () => {
      searchBarBtn.nativeElement.click();
      fixture.detectChanges();
      selectElements();

      spyOn(searchesService, 'recipesByName').and.callFake(() => {
        return of(recipes);
      });
      searchInput.nativeElement.value = 'Eggs';
      searchInput.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      selectElements();

      expect(searchesService.recipesByName).toHaveBeenCalledWith('Eggs', 10);
      expect(searchItemsContainer).toBeTruthy();
      expect(searchItems.length).toEqual(2);
      expect(searchItems[0].nativeElement.innerText).toContain('Eggs');
    });
  
    
    describe('keyboard press keys', () => {
      beforeEach(() => {
        searchBarBtn.nativeElement.click();
        fixture.detectChanges();
        selectElements();
  
        spyOn(searchesService, 'recipesByName').and.callFake(() => {
          return of(recipes);
        });
        searchInput.nativeElement.value = 'Eggs';
        searchInput.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        selectElements();
  
        expect(searchesService.recipesByName).toHaveBeenCalledWith('Eggs', 10);
        expect(searchItemsContainer).toBeTruthy();
        expect(searchItems.length).toEqual(2);
        expect(searchItems[0].nativeElement.innerText).toContain('Eggs');
      });

      it('should navigate through the options when the user uses the down arrow key', () => {
        const event = new KeyboardEvent("keydown",{
          // @ts-ignore
          keyCode: '40'
        });
  
        spyOn(component, 'onKeydown').and.callThrough();
  
        searchInput.nativeElement.dispatchEvent(event);
        fixture.detectChanges();
        selectElements();
  
        expect(component.onKeydown).toHaveBeenCalled();
        expect(searchItems[0].nativeElement).toHaveClass('search--highlighted');      
      });
      
      it('should navigate through the options when the user uses the up arrow key', () => {
        const event = new KeyboardEvent("keydown",{
          // @ts-ignore
          keyCode: '38'
        });
  
        spyOn(component, 'onKeydown').and.callThrough();
  
        searchInput.nativeElement.dispatchEvent(event);
        fixture.detectChanges();
        selectElements();
  
        expect(component.onKeydown).toHaveBeenCalled();
        expect(searchItems[1].nativeElement).toHaveClass('search--highlighted');      
      });

      it('should close the search bar when the user clicks the escape key twice', () => {
        const event = new KeyboardEvent("keydown",{
          // @ts-ignore
          keyCode: '27'
        });
  
        spyOn(component, 'onKeydown').and.callThrough();
  
        spyOn(component, 'onSubmit').and.callThrough();

        // first enter keypress
        searchInput.nativeElement.dispatchEvent(event);
        fixture.detectChanges();
        selectElements();

        // second enter keypress
        searchInput.nativeElement.dispatchEvent(event);
        fixture.detectChanges();
        selectElements();
  
        expect(component.onKeydown).toHaveBeenCalledTimes(2);
        expect(searchItemsContainer).toBeFalsy();
        expect(component.onSubmit).not.toHaveBeenCalled();
        expect(searchInput).toBeFalsy();
        expect(searchItems.length).toEqual(0);
      });

      it('should close the autocomplete items container when the user clicks the escape key', () => {
        const event = new KeyboardEvent("keydown",{
          // @ts-ignore
          keyCode: '27'
        });
  
        spyOn(component, 'onKeydown').and.callThrough();
  
        spyOn(component, 'onSubmit').and.callThrough();

        // first enter keypress
        searchInput.nativeElement.dispatchEvent(event);
        fixture.detectChanges();
        selectElements();
  
        expect(component.onKeydown).toHaveBeenCalledTimes(1);
        expect(searchItemsContainer).toBeFalsy();
        expect(component.onSubmit).not.toHaveBeenCalled();
        expect(searchInput).toBeTruthy();
        expect(searchItems.length).toEqual(0);
      });

      it('should choose an option when the user clicks on an item', () => {
        spyOn(component, 'onSubmit').and.callThrough();
        spyOn(component, 'chooseSearchItem').and.callThrough();

        searchItems[1].nativeElement.click();
        searchItems[1].nativeElement.dispatchEvent(new Event('click'));
        fixture.detectChanges();
        selectElements();

        expect(searchItemsContainer).toBeFalsy();
        expect(component.onSubmit).not.toHaveBeenCalled();
        expect(searchInput.nativeElement.value).toEqual('Eggs and Rice');
      });
    });

    describe('submit', () => {
      beforeEach(() => {
        searchBarBtn.nativeElement.click();
        fixture.detectChanges();
        selectElements();
  
        spyOn(searchesService, 'recipesByName').and.callFake(() => {
          return of(recipes);
        });
        searchInput.nativeElement.value = 'Eggs';
        searchInput.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        selectElements();
      });

      it('should navigate to the recipe view page with the recipe name in the url', () => {
        spyOn(router, 'navigateByUrl');

        searchSubmitBtn.nativeElement.click();
        searchSubmitBtn.nativeElement.dispatchEvent(new Event('click'));
        fixture.detectChanges();

        expect(router.navigateByUrl).toHaveBeenCalledWith('/recipes/Eggs');
      });
    });
  });
});
