import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
// Services
import { RecipeService } from '../../../utilities/services/recipe/recipe.service';
import { Recipe } from '../../../utilities/services/recipe/recipe';
import { AuthService } from '../../../utilities/services/auth/auth.service';
import { UserDecodedToken } from '../../../utilities/services/auth/user-decoded-token';
// Font Awesome
import { faThumbsUp, faFireAlt, faClock, faChevronRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-recipe-view',
  templateUrl: './recipe-view.component.html',
  styleUrls: ['./recipe-view.component.scss']
})
export class RecipeViewComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  user: UserDecodedToken;
  // Font Awesome
  faThumbsUp = faThumbsUp;
  faFireAlt = faFireAlt;
  faClock = faClock;
  faChevronRight = faChevronRight;
  // =======
  recipeParam: string;
  error: string;
  recipe: Recipe;
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute, 
    private recipeService: RecipeService,
    private authService: AuthService,
    private domSanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.recipeParam = this.route.snapshot.params['recipe'];
    // if 'recipeParam' is a number(id), it will return the number
    // and be a truthy value. If the value is a string(name), it will 
    // return NaN and be a falsy value
    if (Number(this.recipeParam)) {
      this.getRecipeById(this.recipeParam);
    } else {
      this.getRecipeByName(this.recipeParam);
    }
    if (this.authService.isLoggedIn()) {
      this.user = this.authService.currentUser();
      console.log(this.user)
    }
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
      console.log(res)
      this.recipe = res;
    }, err => {
      this.loading = false;
      console.log(err)
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
      console.log(res)
      this.recipe = res;
    }, err => {
      this.loading = false;

      // This shows the error message
      this.error = err.error.message;
    });
  }

  // Without this sanitizing the url, the video will not show
  youtubeUrl() {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(this.recipe.youtubeUrl);
  }
}
