import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AdminService } from '../../../utilities/services/admin/admin.service';
import { UsersAdmin } from '../../../utilities/services/admin/users-admin';
// Font Awesome
import { faSort } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  users: UsersAdmin;
  errorMessage: string;
  // Font Awesome
  faSort = faSort;
  // Toggle sort variables
  isSortedByNewest: boolean = false;
  isSortedByUsernameAtoZ: boolean = false;
  isSortedByFirstNameAtoZ: boolean = false;
  isSortedByLastNameAtoZ: boolean = false;
  // pagination loads to show 10 users
  offset: number = 0;
  limit: number = 10;
  initialPageUserNumber: number;
  finalPageUserNumber: number;
  // This is for which property the pagination function should use
  lastUsedProperty: string;
  // Select amount of users to show in the table
  usersShown: Array<number> = [5, 10, 20];

  // This holds the observables. The selected property is used to 
  // show which table header should be highlighted
  adminData = {
    newest: {
      getData: () => this.adminService.getUsersByNewest(this.offset, this.limit),
      selected: false
    },
    oldest: {
      getData: () => this.adminService.getUsersByOldest(this.offset, this.limit),
      selected: false
    },
    usernameAtoZ: {
      getData: () => this.adminService.getUsersByUsernameAtoZ(this.offset, this.limit),
      selected: false
    },
    usernameZtoA: {
      getData: () => this.adminService.getUsersByUsernameZtoA(this.offset, this.limit),
      selected: false
    },
    firstNameAtoZ: {
      getData: () => this.adminService.getUsersByFirstNameAtoZ(this.offset, this.limit),
      selected: false
    },
    firstNameZtoA: {
      getData: () => this.adminService.getUsersByFirstNameZtoA(this.offset, this.limit),
      selected: false
    },
    lastNameAtoZ: {
      getData: () => this.adminService.getUsersByLastNameAtoZ(this.offset, this.limit),
      selected: false
    },
    lastNameZtoA: {
      getData: () => this.adminService.getUsersByLastNameZtoA(this.offset, this.limit),
      selected: false
    }
  }

  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.getAdminData('newest');
    this.isSortedByNewest = true;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  // Update how many users are shown
  updateUserAmountShown(limit) {
    this.limit = limit;
    this.offset = 0;
    this.getAdminData(this.lastUsedProperty);
    this.pageUserNumbers(this.offset, this.limit);
  }

  // This is called when the user changes the number
  // of users shown from the select input
  onChange(value) {
    // Stops the function if the user reselects the 
    // option that shows the instructions
    if (value.slice(0, 4) !== 'Show') return;

    let amount = Number(value.slice(5));
    this.updateUserAmountShown(amount);
  }

  // =================================
  // Pagination Functions
  // =================================

  // Pagination inputs
  onPageChange(offset: number) { 
    this.offset = offset;
    this.getAdminData(this.lastUsedProperty);
  }

  // =================================
  // Data functions
  // =================================

  getAdminData(property) {
    this.adminData[property].getData().pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe(res => {
      this.users = res;
      this.updateSelected(property);
      this.lastUsedProperty = property;
      this.pageUserNumbers(this.offset, this.limit);
    }, err => {
      this.errorMessage = err.error.message;
    });
  }

  updateSelected(property) {
    for (let prop in this.adminData) {
      if (prop === property) {
        this.adminData[prop].selected = true;
      } else {
        this.adminData[prop].selected = false;
      }
    }
  }

  // Shows the numbers of the users shown in the table
  pageUserNumbers(offset, limit) {
    this.initialPageUserNumber = offset + 1;
    let finalNumber = offset + limit;
    if (finalNumber > this.users.count) {
      finalNumber = this.users.count;
    }
    this.finalPageUserNumber = finalNumber;
  }

  // =================================
  // Toggle functions for sorting the table
  // =================================

  // Users by newest and oldest
  toggleSortByDate() {
    if (this.isSortedByNewest) {
      this.getAdminData('oldest');
    } else {
      this.getAdminData('newest');
    }

    // toggle sort
    this.isSortedByNewest = !this.isSortedByNewest;
  }

  // Get users alphabetically by username
  toggleSortByUsername() {
    if (this.isSortedByUsernameAtoZ) {
      this.getAdminData('usernameZtoA');
    } else {
      this.getAdminData('usernameAtoZ');
    }

    // toggle sort
    this.isSortedByUsernameAtoZ = !this.isSortedByUsernameAtoZ;
  }

  // Get users alphabetically by first name
  toggleSortByFirstName() {
    if (this.isSortedByFirstNameAtoZ) {
      this.getAdminData('firstNameAtoZ');
    } else {
      this.getAdminData('firstNameZtoA');
    }

    // toggle sort
    this.isSortedByFirstNameAtoZ = !this.isSortedByFirstNameAtoZ;
  }

  // Get users alphabetically by last name
  toggleSortByLastName() {
    if (this.isSortedByLastNameAtoZ) {
      this.getAdminData('lastNameZtoA');
    } else {
      this.getAdminData('lastNameAtoZ');
    }

    // toggle sort
    this.isSortedByLastNameAtoZ = !this.isSortedByLastNameAtoZ;
  }

  clearErrorMessage() {
    this.errorMessage = '';
  }
}
