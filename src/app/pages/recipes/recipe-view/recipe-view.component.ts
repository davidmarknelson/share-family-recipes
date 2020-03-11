import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// Services
import { RecipeService } from '../../../utilities/services/recipe/recipe.service';
import { Recipe } from '../../../utilities/services/recipe/recipe';
import { AuthService } from '../../../utilities/services/auth/auth.service';
import { UserDecodedToken } from '../../../utilities/services/auth/user-decoded-token';
// Font Awesome
import { faFireAlt, faClock, faChevronRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-recipe-view',
  templateUrl: './recipe-view.component.html',
  styleUrls: ['./recipe-view.component.scss']
})
export class RecipeViewComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  user: UserDecodedToken;
  // Font Awesome
  faFireAlt = faFireAlt;
  faClock = faClock;
  faChevronRight = faChevronRight;
  // =======
  recipeParam: string;
  error: string;
  recipe: Recipe;
  loading: boolean = false;
  isRecipeLiked: boolean;
  isDataLoaded: boolean;

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private recipeService: RecipeService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.route.params.pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe(res => {
      this.recipeParam = res['recipe'];

      // if 'recipeParam' is a number(id), it will return the number
      // and be a truthy value. If the value is a string(name), it will 
      // return NaN and be a falsy value
      if (Number(this.recipeParam)) {
        this.getRecipeById(this.recipeParam);
      } else {
        this.getRecipeByName(this.recipeParam);
      }
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getRecipeById(id) {
    this.loading = true;

    this.recipeService.getRecipeById(id).pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe(res => {
      this.loading = false;

      // The user info must be called before
      // the recipe is assigned because child components require the
      // user data and the recipe data
      this.returnUserObj();
      this.error = '';
      this.recipe = res;
    }, err => {
      this.loading = false;

      // This shows the error message
      this.error = err.error.message;
    });
  }

  getRecipeByName(name) {
    this.loading = true;

    this.recipeService.getRecipeByName(name).pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe(res => {
      this.loading = false;

      // The user info must be called before
      // the recipe is assigned because child components require the
      // user data and the recipe data
      this.returnUserObj();
      this.error = '';
      this.recipe = res;
    }, err => {
      this.loading = false;

      // This shows the error message
      this.error = err.error.message;
    });
  }

  returnUserObj() {
    if (this.authService.isLoggedIn()) {
      this.user = this.authService.currentUser();
    }
  }

  goToEditPage() {
    this.router.navigateByUrl(`/create/edit?recipe=${this.recipe.id}`);
  }

  goToUsersRecipes(username) {
    let encodedUsername = encodeURIComponent(username);
    
    this.router.navigateByUrl(`/recipes/user-recipes?username=${encodedUsername}`);
  }
}
