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
  isInitialLoading: boolean;
  // Font Awesome
  faSort = faSort;
  // Toggle sort
  isSortedByNewest: boolean = false;
  isSortedByUsernameAtoZ: boolean = false;
  isSortedByFirstNameAtoZ: boolean = false;
  isSortedByLastNameAtoZ: boolean = false;
  // Selected column highlight
  isSignedUpSelected: boolean;
  isUsernameSelected: boolean;
  isFirstNameSelected: boolean;
  isLastNameSelected: boolean;
  // pagination
  offset: number = 0;
  limit: number = 10;

  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.isInitialLoading = true;
    this.toggleSortByDate();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  // =================================
  // Users by newest and oldest
  // =================================
  toggleSortByDate() {
    if (this.isSortedByNewest) {
      this.getUsersByOldest(this.offset, this.limit);
    } else {
      this.getUsersByNewest(this.offset, this.limit);
    }
    // Selected column highlight
    this.isSignedUpSelected = true;
    this.isUsernameSelected = false;
    this.isFirstNameSelected = false;
    this.isLastNameSelected = false;

    // toggle sort
    this.isSortedByNewest = !this.isSortedByNewest;
  }

  getUsersByNewest(offset, limit) {
    this.adminService.getUsersByNewest(offset, limit).pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe(res => {
      // This is to stop the first inital loading message
      this.isInitialLoading = false;
      this.users = res;
    }, err => {
      // This is to stop the first inital loading message
      this.isInitialLoading = false;
      this.errorMessage = err.error.message;
    });
  }

  getUsersByOldest(offset, limit) {
    this.adminService.getUsersByOldest(offset, limit).pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe(res => {
      this.users = res;
    }, err => {
      this.errorMessage = err.error.message;
    });
  }

  // =================================
  // Get users alphabetically by username
  // =================================
  toggleSortByUsername() {
    if (this.isSortedByUsernameAtoZ) {
      this.getUsersByUsernameZtoA(this.offset, this.limit);
    } else {
      this.getUsersByUsernameAtoZ(this.offset, this.limit);
    }
    // Selected column highlight
    this.isUsernameSelected = true;
    this.isSignedUpSelected = false;
    this.isFirstNameSelected = false;
    this.isLastNameSelected = false;

    // toggle sort
    this.isSortedByUsernameAtoZ = !this.isSortedByUsernameAtoZ;
  }

  getUsersByUsernameAtoZ(offset, limit) {
    this.adminService.getUsersByUsernameAtoZ(offset, limit).pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe(res => {
      this.users = res;
    }, err => {
      this.errorMessage = err.error.message;
    });
  }

  getUsersByUsernameZtoA(offset, limit) {
    this.adminService.getUsersByUsernameZtoA(offset, limit).pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe(res => {
      this.users = res;
    }, err => {
      this.errorMessage = err.error.message;
    });
  }

  // =================================
  // Get users alphabetically by first name
  // =================================
  toggleSortByFirstName() {
    if (this.isSortedByFirstNameAtoZ) {
      this.getUsersByFirstNameZtoA(this.offset, this.limit);
    } else {
      this.getUsersByFirstNameAtoZ(this.offset, this.limit);
    }
    // Selected column highlight
    this.isFirstNameSelected = true;
    this.isUsernameSelected = false;
    this.isSignedUpSelected = false;
    this.isLastNameSelected = false;

    // toggle sort
    this.isSortedByFirstNameAtoZ = !this.isSortedByFirstNameAtoZ;
  }

  getUsersByFirstNameAtoZ(offset, limit) {
    this.adminService.getUsersByFirstNameAtoZ(offset, limit).pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe(res => {
      this.users = res;
    }, err => {
      this.errorMessage = err.error.message;
    });
  }

  getUsersByFirstNameZtoA(offset, limit) {
    this.adminService.getUsersByFirstNameZtoA(offset, limit).pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe(res => {
      this.users = res;
    }, err => {
      this.errorMessage = err.error.message;
    });
  }

  // =================================
  // Get users alphabetically by last name
  // =================================
  toggleSortByLastName() {
    if (this.isSortedByLastNameAtoZ) {
      this.getUsersByLastNameZtoA(this.offset, this.limit);
    } else {
      this.getUsersByLastNameAtoZ(this.offset, this.limit);
    }
    // Selected column highlight
    this.isLastNameSelected = true;
    this.isFirstNameSelected = false;
    this.isUsernameSelected = false;
    this.isSignedUpSelected = false;

    // toggle sort
    this.isSortedByLastNameAtoZ = !this.isSortedByLastNameAtoZ;
  }

  getUsersByLastNameAtoZ(offset, limit) {
    this.adminService.getUsersByLastNameAtoZ(offset, limit).pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe(res => {
      this.users = res;
    }, err => {
      this.errorMessage = err.error.message;
    });
  }

  getUsersByLastNameZtoA(offset, limit) {
    this.adminService.getUsersByLastNameZtoA(offset, limit).pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe(res => {
      this.users = res;
    }, err => {
      this.errorMessage = err.error.message;
    });
  }

  clearErrorMessage() {
    this.errorMessage = '';
  }
}
