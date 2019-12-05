import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { toast } from 'bulma-toast';
// Services
import { RecipeService } from '../../../utilities/services/recipe/recipe.service';
import { Recipe } from '../../../utilities/services/recipe/recipe';
import { AuthService } from '../../../utilities/services/auth/auth.service';
import { UserDecodedToken } from '../../../utilities/services/auth/user-decoded-token';
import { LikesService } from '../../../utilities/services/likes/likes.service';
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
  isRecipeLiked: boolean;

  constructor(
    private route: ActivatedRoute, 
    private recipeService: RecipeService,
    private authService: AuthService,
    private likesService: LikesService
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

      this.checkLikes();
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

      this.checkLikes();
    }, err => {
      this.loading = false;

      // This shows the error message
      this.error = err.error.message;
    });
  }

  toggleLikes() {
    // Loop through array of likes to find user's id
    for (let i = 0; i < this.recipe.likes.length; i++) {
      if (this.recipe.likes[i].userId === this.user.id) {
        // Remove a like if the user is in the array of likes
        return this.likesService.removeLike(this.recipe.id).pipe(
          takeUntil(this.ngUnsubscribe)
        ).subscribe(res => {
          // remove userId for change detection
          this.recipe.likes.splice(i, 1);

          // This removes the highlight from the likes button
          this.isRecipeLiked = false;
        }, err => {
          this.errorToast(err.error.message);
        });
      }
    }

    this.likesService.addLike(this.recipe.id).pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe(res => {
      // add userId for change detection
      this.recipe.likes.unshift({ userId: this.user.id});

      // This adds the highlight from the likes button
      this.isRecipeLiked = true;
    }, err => {
      this.errorToast(err.error.message);
    });
  }

  // A function to reduce the amount of code written for toasts
  errorToast(message) {
    toast({
      message: message,
      type: "is-danger",
      dismissible: true,
      duration: 5000,
      position: "top-center",
      closeOnClick: true,
      pauseOnHover: true
    });
  }

  // This checks likes when the page loads
  checkLikes() {
    if (this.user) {
      for (let like of this.recipe.likes) {
        if (like.userId === this.user.id) {
          this.isRecipeLiked = true;
        } else {
          this.isRecipeLiked = false;
        }
      }
    }
  }
}
