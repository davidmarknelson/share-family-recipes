import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../utilities/services/auth/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { filter, debounceTime, mergeMap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { SearchesService } from '../../utilities/services/searches/searches.service';
import { AutocompleteItems } from '../../utilities/services/searches/autocomplete-items';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @ViewChild('name', {static: false}) nameInput: ElementRef;
  faSearch = faSearch;
  showMenu: boolean = false;
  isLoggedIn: boolean;
  searchBarForm: FormGroup;
  isSearchOpen: boolean;
  autocompleteItems: Array<AutocompleteItems> = [];
  highlightedIndex: number = -1;
  isAutocompleteOptionSelected: boolean;

  constructor(
    private fb: FormBuilder, 
    private auth: AuthService, 
    private router: Router,
    private searchesService: SearchesService,
    private changeDetector : ChangeDetectorRef
  ) {
    this.auth.loggedIn.subscribe(status => this.isLoggedIn = status);
  }

  ngOnInit() {
    this.isLoggedIn = this.auth.isLoggedIn();
    this.renewToken();
    this.createForm();
    this.onNameChanges();
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
    this.isSearchOpen = false;
  }

  renewToken() {
    if (this.isLoggedIn) {
      this.auth.renewToken().subscribe();
    } else {
      this.auth.logout();
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }

  goToYourRecipes() {
    let userName = this.auth.currentUser().username;

    this.router.navigateByUrl(`/recipes/user-recipes?username=${userName}`);
  }

  // =================
  // Search bar
  // =================
  toggleSearchBar() {
    this.isSearchOpen = !this.isSearchOpen;
    this.changeDetector.detectChanges();
    if (this.isSearchOpen) {
      this.nameInput.nativeElement.focus();
    } else {
      this.searchBarForm.get('name').setValue('');
    }
  }

  closeSearchBar() {
    this.isSearchOpen = false;
    this.searchBarForm.get('name').setValue('');
  }

  createForm() {
    this.searchBarForm = this.fb.group({
      name: ''
    });
  }

  // This checks recipe names
  onNameChanges() {
    this.searchBarForm.get('name').valueChanges
      .pipe(
        switchMap(val => {
          // This returns false and changes the value so the autocompleteItems box will not show this 
          // one time. The next valueChanges will show autocompleteItems
          if (this.isAutocompleteOptionSelected) {
            return of(this.isAutocompleteOptionSelected = !this.isAutocompleteOptionSelected);
          }

          // This returns an empty array to make the autocomplete box close.
          // If it does not return an empty array, the database will return 
          // the first 10 results.
          if (val.length === 0) {
            return of([]);
          } else {
            return this.searchesService.recipesByName(val, 10);
          }
        }),
      ).subscribe((res: Array<AutocompleteItems>) => {
        this.highlightedIndex = -1;

        if (Array.isArray(res)) {
          this.autocompleteItems = res;
        } else {
          this.autocompleteItems = [];
        }
      }, err => {
        // close the box and reset options
        this.autocompleteItems = [];
        // The api returns a 404 error when there are no results.
        // This resubscribes to the observable because subscriptions 
        // complete on errors.
        this.onNameChanges();
      });
  }

  onKeydown(key) {
    // arrow down
    if (key.keyCode === 40) {
      key.preventDefault();
      // if the user keeps pressing the arrow down at the end of the 
      // autocompleteItem list, this will reset 
      // the highlightedIndex to the first autocompleteItem
      if (this.highlightedIndex === this.autocompleteItems.length - 1) {
        this.highlightedIndex = 0;
      } else {
        this.highlightedIndex = this.highlightedIndex + 1;
      }
    }

    // arrow up
    if (key.keyCode === 38) {
      key.preventDefault();
      // if the user keeps pressing the arrow up at the beginning of the 
      // autocompleteItem list, this will reset 
      // the highlightedIndex to the last autocompleteItem
      if (this.highlightedIndex === 0 || this.highlightedIndex === -1) {
        this.highlightedIndex = this.autocompleteItems.length - 1;
      } else {
        this.highlightedIndex = this.highlightedIndex - 1;
      }
    }

    // enter
    if (key.keyCode === 13) {
      // prevent default if the autocomplete box is visible
      if (this.autocompleteItems.length > 0) {
        key.preventDefault();

        // this dismisses autocompleteItems if the user has not selected an option
        if (this.highlightedIndex === -1) {
          return this.autocompleteItems = [];
        }

        // Changes the value to true so onNameChanges will not update the autocompleteItems box
        this.isAutocompleteOptionSelected = true;
        this.searchBarForm.get('name').setValue(this.autocompleteItems[this.highlightedIndex].name);
      }
    }
  }

  onSubmit() {
    this.router.navigateByUrl(`/recipes/${this.searchBarForm.get('name').value}`);
    this.toggleSearchBar();
  }
}
