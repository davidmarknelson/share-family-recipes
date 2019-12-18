import { Component, OnInit , OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// Services
import { SearchesService } from '../../../utilities/services/searches/searches.service';
import { RecipeCardInfo } from '../../../utilities/services/searches/recipe-card-info';
import { AuthService } from '../../../utilities/services/auth/auth.service';
import { UserDecodedToken } from '../../../utilities/services/auth/user-decoded-token';


@Component({
  selector: 'app-recipe-browse',
  templateUrl: './recipe-browse.component.html',
  styleUrls: ['./recipe-browse.component.scss']
})
export class RecipeBrowseComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  // Form for ingredients
  ingredientInput = { ingredient: '' };
  ingredients: Array<string> = [];
  ingredientError: string;
  // ============
  recipes: RecipeCardInfo;
  errorMessage: string;
  user: UserDecodedToken;
  // Sorting
  sortingOption: string = 'newest';
  // pagination
  offset: number = 0;
  limit: number = 9;
  initialPageRecipeNumber: number;
  finalPageRecipeNumber: number;
  // Select amount of recipes to show 
  recipesShown: Array<number> = [9, 18];

  constructor(
    private searchesService: SearchesService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.user = this.authService.currentUser();
    this.getData('newest', this.offset, this.limit);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  // =================================
  // Data Objects
  // =================================
  // An object to hold all of the data
  data: Object = {
    newest: (offset, limit) => this.searchesService.newest(offset, limit),
    oldest: (offset, limit) => this.searchesService.oldest(offset, limit),
    byNamesAtoZ: (offset, limit) => this.searchesService.byNamesAtoZ(offset, limit),
    byNamesZtoA: (offset, limit) => this.searchesService.byNamesZtoA(offset, limit)
  }

  // Holds the functions to get the list of recipes matching 
  // the ingredients
  ingredientData: Object = {
    ingredientsByNewest: (offset, limit, ingredients) => 
      this.searchesService.ingredientsByNewest(offset, limit, ingredients),
    ingredientsByOldest: (offset, limit, ingredients) => 
      this.searchesService.ingredientsByOldest(offset, limit, ingredients),
    ingredientsByNameAtoZ: (offset, limit, ingredients) => 
      this.searchesService.ingredientsByNameAtoZ(offset, limit, ingredients),
    ingredientsByNameZtoA: (offset, limit, ingredients) => 
      this.searchesService.ingredientsByNameZtoA(offset, limit, ingredients)
  }

  // =================================
  // Data Functions
  // =================================
  // A function to get the data depending of which sorting option was sent
  getData(sortingOption, offset, limit): Observable<RecipeCardInfo> {
    return this.data[sortingOption](offset, limit).pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe((res: RecipeCardInfo) => {
      this.errorMessage = '';
      this.recipes = res;
      this.pageRecipeNumbers(this.offset, this.limit);
    }, err => {
      this.errorMessage = err.error.message;
    });
  }

  // Get data when there are ingredients in the ingredients array
  getIngredientData(sortingOption, offset, limit, ingredients): Observable<RecipeCardInfo> {
    return this.ingredientData[sortingOption](offset, limit, ingredients).pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe((res: RecipeCardInfo) => {
      this.errorMessage = '';
      this.recipes = res;
      this.pageRecipeNumbers(this.offset, this.limit);
    }, err => {
      this.errorMessage = err.error.message;
    });
  }

  // =================================
  // Sorting Functions
  // =================================
  getSortingOptionForIngredients(sortingOption) {
    let ingredientSortingOption;

    if (sortingOption === 'newest') {
      ingredientSortingOption = 'ingredientsByNewest';
    } else if (sortingOption === 'oldest') {
      ingredientSortingOption = 'ingredientsByOldest';
    } else if (sortingOption === 'byNamesAtoZ') {
      ingredientSortingOption = 'ingredientsByNameAtoZ';
    } else {
      ingredientSortingOption = 'ingredientsByNameZtoA';
    }

    return ingredientSortingOption;
  }

  getDataOrIngredientData(): Observable<RecipeCardInfo> {
    if (this.ingredients.length > 0) {
      return this.getIngredientData(
        this.getSortingOptionForIngredients(this.sortingOption),
        this.offset,
        this.limit,
        this.ingredients
      );
    } else {
      return this.getData(this.sortingOption, this.offset, this.limit);
    }
  }

  // Change how to sort the recipes
  onSortingChange(value: string): Observable<RecipeCardInfo> {
    if (value === 'A - Z') {
      this.sortingOption = 'byNamesAtoZ';
    } else if (value === 'Z - A') {
      this.sortingOption = 'byNamesZtoA';
    } else {
      this.sortingOption = value.toLowerCase();
    }

    return this.getDataOrIngredientData();
  }

  // =================================
  // Ingredient Functions
  // =================================
  addIngredient(ingredient) {
    if (!ingredient.ingredient) {
      return this.ingredientError = 'You must add an ingredient.'
    }

    this.ingredients.push(ingredient.ingredient);

    this.ingredientInput.ingredient = '';

    return this.getIngredientData(
      this.getSortingOptionForIngredients(this.sortingOption),
      this.offset,
      this.limit,
      this.ingredients
    );
  }

  clearIngredient(index): Observable<RecipeCardInfo> {
    this.ingredients.splice(index,1);

    return this.getDataOrIngredientData();
  }

  clearIngredients(): Observable<RecipeCardInfo> {
    this.ingredients = [];

    return this.getDataOrIngredientData();
  }

  // =================================
  // Pagination Functions
  // =================================

  // Pagination inputs
  onPageChange(offset: number) { 
    this.offset = offset;

    this.getDataOrIngredientData();
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
    return this.getDataOrIngredientData();
  }

  // =================================
  // Clear Errors
  // =================================
  clearIngredientError() {
    this.ingredientError = '';
  }

  clearErrorMessage() {
    this.errorMessage = '';
  }

}
