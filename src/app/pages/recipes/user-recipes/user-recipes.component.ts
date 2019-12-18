import { Component, OnInit , OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
// Services
import { SearchesService } from '../../../utilities/services/searches/searches.service';
import { UserRecipeCardInfo } from '../../../utilities/services/searches/user-recipe-card-info';
import { AuthService } from '../../../utilities/services/auth/auth.service';
import { UserDecodedToken } from '../../../utilities/services/auth/user-decoded-token';

@Component({
  selector: 'app-user-recipes',
  templateUrl: './user-recipes.component.html',
  styleUrls: ['./user-recipes.component.scss']
})
export class UserRecipesComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  // =============
  recipes: UserRecipeCardInfo;
  errorMessage: string;
  // This is used to not show the 'Getting data...'
  // message when the user deletes the error message
  isPageError: boolean;
  user: UserDecodedToken;
  username: string;
  // Sorting
  sortingOption: string = 'byUsernameAtoZ';
  // pagination
  offset: number = 0;
  limit: number = 9;
  initialPageRecipeNumber: number;
  finalPageRecipeNumber: number;
  // Select amount of recipes to show 
  recipesShown: Array<number> = [9, 18];

  constructor(
    private searchesService: SearchesService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.username = this.route.snapshot.queryParams['username'];
    if (!this.username) {
      this.isPageError = true;
      return this.errorMessage = 'There was an error. You must search for a user.';
    }

    this.user = this.authService.currentUser();
    this.getData(this.sortingOption, this.offset, this.limit, this.username);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  data: Object = {
    byUsernameAtoZ: (offset, limit, username) => 
      this.searchesService.byUsernameAtoZ(offset, limit, username),
    byUsernameZtoA: (offset, limit, username) => 
      this.searchesService.byUsernameZtoA(offset, limit, username),
  }

  // A function to get the data depending of which sorting option was sent
  getData(sortingOption, offset, limit, username): Observable<UserRecipeCardInfo> {
    return this.data[sortingOption](offset, limit, username).pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe((res: UserRecipeCardInfo) => {
      this.errorMessage = '';
      this.recipes = res;
      this.pageRecipeNumbers(this.offset, this.limit);
    }, err => {
      this.errorMessage = err.error.message;
    });
  }

  // Change how to sort the recipes
  onSortingChange(value: string): Observable<UserRecipeCardInfo> {
    if (value === 'A - Z') {
      this.sortingOption = 'byUsernameAtoZ';
    } else {
      this.sortingOption = 'byUsernameZtoA';
    }

    return this.getData(this.sortingOption, this.offset, this.limit, this.username);
  }

  // Pagination inputs
  onPageChange(offset: number) { 
    this.offset = offset;

    return this.getData(this.sortingOption, this.offset, this.limit, this.username);
  }

  // Shows the numbers of the recipes shown in the table
  pageRecipeNumbers(offset, limit) {
    this.initialPageRecipeNumber = offset + 1;
    let finalNumber = offset + limit;
    if (finalNumber > this.recipes.count) {
      finalNumber = this.recipes.count;
    }
    this.finalPageRecipeNumber = finalNumber;
  }

  // This is called when the user changes the number
  // of recipes shown from the select input
  onAmountChange(value) {
    this.limit = Number(value.slice(5));
    this.offset = 0;
    return this.getData(this.sortingOption, this.offset, this.limit, this.username);
  }

  clearErrorMessage() {
    this.errorMessage = '';
  }

}
