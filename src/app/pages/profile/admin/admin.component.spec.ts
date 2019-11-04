import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AdminComponent } from './admin.component';
import { UsersAdmin } from '../../../utilities/services/admin/users-admin';
import { AdminService } from '../../../utilities/services/admin/admin.service';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';


let fixture: ComponentFixture<AdminComponent>;
let headerSignedUp: DebugElement;
let headerSignedUpLink: DebugElement;
let headerUsername: DebugElement;
let headerUsernameLink: DebugElement;
let headerFirstName: DebugElement;
let headerFirstNameLink: DebugElement;
let headerLastName: DebugElement;
let headerLastNameLink: DebugElement;

function selectHeaders() {
  headerSignedUp = fixture.debugElement.query(By.css('[data-test=headerSignedUp]'));
  headerSignedUpLink = fixture.debugElement.query(By.css('[data-test=headerSignedUp] > a'));
  headerUsername = fixture.debugElement.query(By.css('[data-test=headerUsername]'));
  headerUsernameLink = fixture.debugElement.query(By.css('[data-test=headerUsername] > a'));
  headerFirstName = fixture.debugElement.query(By.css('[data-test=headerFirstName]'));
  headerFirstNameLink = fixture.debugElement.query(By.css('[data-test=headerFirstName] > a'));
  headerLastName = fixture.debugElement.query(By.css('[data-test=headerLastName]'));
  headerLastNameLink = fixture.debugElement.query(By.css('[data-test=headerLastName] > a'));
}

const userArrayResponse: UsersAdmin = {
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
      "createdAt": "Oct 10, 2019",
      "meals": [
        { "id": 1 }
      ]
    }
  ]
}

class MockAdminService {
  getUsersByNewest(offset, limit) {
    return of();
  }

  getUsersByOldest(offset, limit) {
    return of();
  }

  getUsersByUsernameAtoZ(offset, limit) {
    return of();
  }

  getUsersByUsernameZtoA(offset, limit) {
    return of();
  }

  getUsersByFirstNameAtoZ(offset, limit) {
    return of();
  }

  getUsersByFirstNameZtoA(offset, limit) {
    return of();
  }

  getUsersByLastNameAtoZ(offset, limit) {
    return of();
  }

  getUsersByLastNameZtoA(offset, limit) {
    return of();
  }
}

describe('AdminComponent', () => {
  let component: AdminComponent;
  let adminService: AdminService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [
        { provide: AdminService, useClass:  MockAdminService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    adminService = fixture.debugElement.injector.get(AdminService);
    spyOn(component, 'getAdminData').and.callThrough();
    spyOn(adminService, 'getUsersByNewest').and.callFake(() => {
      return of(userArrayResponse);
    });
    fixture.detectChanges();
    selectHeaders();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    it('should call getUsersByNewest and poplulate the table and highlight the selected column', () => {
      // Test initialization
      expect(component.getAdminData).toHaveBeenCalled();
      expect(adminService.getUsersByNewest).toHaveBeenCalled();

      // Select table data to check if it has been populated
      const tableData = fixture.debugElement.query(By.css('tbody > tr > td'));
      expect(tableData.nativeElement.innerText).toEqual('johndoe');

      // Check the header is highlighted
      expect(headerSignedUp.classes['table__sorted-column']).toEqual(true);
      expect(headerFirstName.classes['table__sorted-column']).toEqual(false);
      expect(headerUsername.classes['table__sorted-column']).toEqual(false);
      expect(headerLastName.classes['table__sorted-column']).toEqual(false);
    });
  });

  // =================================
  // Users by newest and oldest
  // =================================
  describe('sorting Signed Up', () => {
    it('should call getUsersByOldest when selected', () => {
      // Test initialization
      expect(adminService.getUsersByNewest).toHaveBeenCalled();
      // This is changed to true during the initialization
      component.isSortedByNewest = true;

      // Spys
      spyOn(component, 'toggleSortByDate').and.callThrough();
      spyOn(adminService, 'getUsersByOldest').and.callFake(() => {
        return of(userArrayResponse);
      });

      // Click header link
      headerSignedUpLink.nativeElement.click();
      headerSignedUpLink.nativeElement.dispatchEvent(new Event('click'));
      fixture.detectChanges();

      // Check that header is highlighted
      expect(headerSignedUp.classes['table__sorted-column']).toEqual(true);
      expect(headerUsername.classes['table__sorted-column']).toEqual(false);
      expect(headerFirstName.classes['table__sorted-column']).toEqual(false);
      expect(headerLastName.classes['table__sorted-column']).toEqual(false);

      // Test spy calls
      expect(component.toggleSortByDate).toHaveBeenCalled();
      expect(adminService.getUsersByOldest).toHaveBeenCalled();
    });
  });

  // =================================
  // Get users alphabetically by username
  // =================================
  describe('sorting by username', () => {
    it('should call getUsersByUsernameAtoZ when selected', () => {
      // Test initialization
      expect(adminService.getUsersByNewest).toHaveBeenCalled();
      // This is changed to true during the initialization
      component.isSortedByNewest = true;

      // Spys
      spyOn(component, 'toggleSortByUsername').and.callThrough();
      spyOn(adminService, 'getUsersByUsernameAtoZ').and.callFake(() => {
        return of(userArrayResponse);
      });


      // Click header link
      headerUsernameLink.nativeElement.click();
      headerUsernameLink.nativeElement.dispatchEvent(new Event('click'));
      fixture.detectChanges();

      // Check that header is highlighted
      expect(headerSignedUp.classes['table__sorted-column']).toEqual(false);
      expect(headerUsername.classes['table__sorted-column']).toEqual(true);
      expect(headerFirstName.classes['table__sorted-column']).toEqual(false);
      expect(headerLastName.classes['table__sorted-column']).toEqual(false);

      // Test spy calls
      expect(component.toggleSortByUsername).toHaveBeenCalled();
      expect(adminService.getUsersByUsernameAtoZ).toHaveBeenCalled();
    });

    it('should call getUsersByUsernameZtoA when the username header is clicked a second time', () => {
      // Test initialization
      expect(adminService.getUsersByNewest).toHaveBeenCalled();
      // This is changed to true during the initialization
      component.isSortedByNewest = true;

      // This is set to true the first time the header is clicked
      component.isSortedByUsernameAtoZ = true;
      // Spys
      spyOn(component, 'toggleSortByUsername').and.callThrough();
      spyOn(adminService, 'getUsersByUsernameZtoA').and.callFake(() => {
        return of(userArrayResponse);
      });


      // Click header link
      headerUsernameLink.nativeElement.click();
      headerUsernameLink.nativeElement.dispatchEvent(new Event('click'));
      fixture.detectChanges();

      // Check that header is highlighted
      expect(headerSignedUp.classes['table__sorted-column']).toEqual(false);
      expect(headerUsername.classes['table__sorted-column']).toEqual(true);
      expect(headerFirstName.classes['table__sorted-column']).toEqual(false);
      expect(headerLastName.classes['table__sorted-column']).toEqual(false);

      // Test spy calls
      expect(component.toggleSortByUsername).toHaveBeenCalled();
      expect(adminService.getUsersByUsernameZtoA).toHaveBeenCalled();
    });
  });

  // =================================
  // Get users alphabetically by first name
  // =================================
  describe('sorting by first name', () => {
    it('should call getUsersByFirstNameAtoZ when selected', () => {
      // Test initialization
      expect(adminService.getUsersByNewest).toHaveBeenCalled();
      // This is changed to true during the initialization
      component.isSortedByFirstNameAtoZ = true;

      // Spys
      spyOn(component, 'toggleSortByFirstName').and.callThrough();
      spyOn(adminService, 'getUsersByFirstNameAtoZ').and.callFake(() => {
        return of(userArrayResponse);
      });


      // Click header link
      headerFirstNameLink.nativeElement.click();
      headerFirstNameLink.nativeElement.dispatchEvent(new Event('click'));
      fixture.detectChanges();

      // Check that header is highlighted
      expect(headerSignedUp.classes['table__sorted-column']).toEqual(false);
      expect(headerUsername.classes['table__sorted-column']).toEqual(false);
      expect(headerFirstName.classes['table__sorted-column']).toEqual(true);
      expect(headerLastName.classes['table__sorted-column']).toEqual(false);

      // Test spy calls
      expect(component.toggleSortByFirstName).toHaveBeenCalled();
      expect(adminService.getUsersByFirstNameAtoZ).toHaveBeenCalled();
    });

    it('should call getUsersByFirstNameAtoZ when the username header is clicked a second time', () => {
      // Test initialization
      expect(adminService.getUsersByNewest).toHaveBeenCalled();
      // This is changed to true during the initialization
      component.isSortedByNewest = true;

      // This is set to true the first time the header is clicked
      component.isSortedByUsernameAtoZ = true;
      // Spys
      spyOn(component, 'toggleSortByFirstName').and.callThrough();
      spyOn(adminService, 'getUsersByFirstNameAtoZ').and.callFake(() => {
        return of(userArrayResponse);
      });


      // Click header link
      headerFirstNameLink.nativeElement.click();
      headerFirstNameLink.nativeElement.dispatchEvent(new Event('click'));
      fixture.detectChanges();

      // Check that header is highlighted
      expect(headerSignedUp.classes['table__sorted-column']).toEqual(false);
      expect(headerUsername.classes['table__sorted-column']).toEqual(false);
      expect(headerFirstName.classes['table__sorted-column']).toEqual(true);
      expect(headerLastName.classes['table__sorted-column']).toEqual(false);

      // Test spy calls
      expect(component.toggleSortByFirstName).toHaveBeenCalled();
      expect(adminService.getUsersByFirstNameAtoZ).toHaveBeenCalled();
    });
  });

  // =================================
  // Get users alphabetically by last name
  // =================================
  describe('sorting by last name', () => {
    it('should call getUsersByLastNameAtoZ when selected', () => {
      // Test initialization
      expect(adminService.getUsersByNewest).toHaveBeenCalled();
      // This is changed to true during the initialization
      component.isSortedByLastNameAtoZ = true;

      // Spys
      spyOn(component, 'toggleSortByLastName').and.callThrough();
      spyOn(adminService, 'getUsersByLastNameAtoZ').and.callFake(() => {
        return of(userArrayResponse);
      });


      // Click header link
      headerLastNameLink.nativeElement.click();
      headerLastNameLink.nativeElement.dispatchEvent(new Event('click'));
      fixture.detectChanges();

      // Check that header is highlighted
      expect(headerSignedUp.classes['table__sorted-column']).toEqual(false);
      expect(headerUsername.classes['table__sorted-column']).toEqual(false);
      expect(headerFirstName.classes['table__sorted-column']).toEqual(false);
      expect(headerLastName.classes['table__sorted-column']).toEqual(true);

      // Test spy calls
      expect(component.toggleSortByLastName).toHaveBeenCalled();
      expect(adminService.getUsersByLastNameAtoZ).toHaveBeenCalled();
    });

    it('should call getUsersByLastNameAtoZ when the username header is clicked a second time', () => {
      // Test initialization
      expect(adminService.getUsersByNewest).toHaveBeenCalled();
      // This is changed to true during the initialization
      component.isSortedByNewest = true;

      // This is set to true the first time the header is clicked
      component.isSortedByLastNameAtoZ = true;
      // Spys
      spyOn(component, 'toggleSortByLastName').and.callThrough();
      spyOn(adminService, 'getUsersByLastNameAtoZ').and.callFake(() => {
        return of(userArrayResponse);
      });


      // Click header link
      headerLastNameLink.nativeElement.click();
      headerLastNameLink.nativeElement.dispatchEvent(new Event('click'));
      fixture.detectChanges();

      // Check that header is highlighted
      expect(headerSignedUp.classes['table__sorted-column']).toEqual(false);
      expect(headerUsername.classes['table__sorted-column']).toEqual(false);
      expect(headerFirstName.classes['table__sorted-column']).toEqual(false);
      expect(headerLastName.classes['table__sorted-column']).toEqual(true);

      // Test spy calls
      expect(component.toggleSortByLastName).toHaveBeenCalled();
      expect(adminService.getUsersByLastNameAtoZ).toHaveBeenCalled();
    });
  });

  describe('select amount of users', () => {
    it('should call getAdminData when the user changes the number of users shown', () => {
       // Test initialization
       expect(adminService.getUsersByNewest).toHaveBeenCalled();
       expect(component.getAdminData).toHaveBeenCalledTimes(1);

       const select = fixture.debugElement.query(By.css('select'));

       select.nativeElement.value = 'Show 5';
       select.nativeElement.dispatchEvent(new Event('change'));
       fixture.detectChanges();

       expect(component.getAdminData).toHaveBeenCalledTimes(2);
    });
  });

  describe('error', () => {
    it('should be shown above the table', () => {
      // Test initialization
      expect(adminService.getUsersByNewest).toHaveBeenCalled();
      expect(component.getAdminData).toHaveBeenCalledTimes(1);

      // Spys
      spyOn(component, 'toggleSortByDate').and.callThrough();
      spyOn(adminService, 'getUsersByOldest').and.callFake(() => {
        return throwError({ error: {
          message: 'There was an error getting the list of users.'
        }});
      });

      // Click header link
      headerSignedUpLink.nativeElement.click();
      headerSignedUpLink.nativeElement.dispatchEvent(new Event('click'));
      fixture.detectChanges();

      // Check that header is highlighted
      expect(headerSignedUp.classes['table__sorted-column']).toEqual(true);
      expect(headerUsername.classes['table__sorted-column']).toEqual(false);
      expect(headerFirstName.classes['table__sorted-column']).toEqual(false);
      expect(headerLastName.classes['table__sorted-column']).toEqual(false);

      // Test spy calls
      expect(component.toggleSortByDate).toHaveBeenCalled();
      expect(adminService.getUsersByOldest).toHaveBeenCalled();

      const errorMsg = fixture.debugElement.query(By.css('.error-msg'));

      expect(errorMsg).toBeTruthy();
      expect(errorMsg.nativeElement.innerText).toEqual('There was an error getting the list of users.');
    });
  });
});
