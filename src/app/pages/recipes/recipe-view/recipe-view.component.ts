import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable, iif, throwError, of } from "rxjs";
import {
  tap,
  map,
  switchMap,
  catchError,
  distinctUntilChanged,
  mergeMap,
  retryWhen,
} from "rxjs/operators";
// Services
import { RecipeService } from "@utilities/services/recipe/recipe.service";
import { Recipe } from "@utilities/services/recipe/recipe";
import { AuthService } from "@utilities/services/auth/auth.service";
import { UserDecodedToken } from "@utilities/services/auth/user-decoded-token";
// Font Awesome
import {
  faFireAlt,
  faClock,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-recipe-view",
  templateUrl: "./recipe-view.component.html",
  styleUrls: ["./recipe-view.component.scss"],
})
export class RecipeViewComponent implements OnInit {
  user: UserDecodedToken;
  // Font Awesome
  faFireAlt = faFireAlt;
  faClock = faClock;
  faChevronRight = faChevronRight;
  // =======
  error: string = "";

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private authService: AuthService
  ) {}

  ngOnInit() {}

  returnUserObj() {
    if (this.authService.isLoggedIn()) {
      this.user = this.authService.currentUser();
    }
  }

  getRecipe$: Observable<Recipe | { message: string }> = this.route.params.pipe(
    map((param) => param["recipe"]),
    distinctUntilChanged(),
    switchMap((param) =>
      iif(
        () => !!Number(param),
        this.recipeService.getRecipeById(param).pipe(
          tap(() => this.returnUserObj()),
          catchError((err) => {
            this.error = err.error.message;
            return of(err.error.message);
          })
        ),
        this.recipeService.getRecipeByName(param).pipe(
          tap(() => this.returnUserObj()),
          catchError((err) => {
            this.error = err.error.message;
            return of(err.error.message);
          })
        )
      )
    )
  );
}
