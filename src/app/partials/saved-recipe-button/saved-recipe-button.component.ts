import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// Toast
import { toast } from 'bulma-toast';
// Services
import { Recipe } from '../../utilities/services/recipe/recipe';
import { SavedRecipesService } from '../../utilities/services/saved-recipes/saved-recipes.service';
import { UserDecodedToken } from '../../utilities/services/auth/user-decoded-token';
@Component({
  selector: 'app-saved-recipe-button',
  templateUrl: './saved-recipe-button.component.html',
  styleUrls: ['./saved-recipe-button.component.scss']
})
export class SavedRecipeButtonComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  @Input() user: UserDecodedToken;
  @Input() recipe: Recipe;
  isRecipeSaved: boolean;

  constructor(private savedRecipesService: SavedRecipesService) { }

  ngOnInit() {
    this.checkSaved();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  toggleSaveRecipes() {
    if (!this.user) {
      return this.errorToast('You must be signed in to do that.');
    }

    for (let i = 0; i < this.recipe.savedRecipes.length; i++) {
      if (this.recipe.savedRecipes[i].userId === this.user.id) {
        return this.savedRecipesService.unsaveRecipe(this.recipe.id).pipe(
          takeUntil(this.ngUnsubscribe)
        ).subscribe(res => {
          // remove userId for change detection
          this.recipe.savedRecipes.splice(i, 1);

          // This removes the highlight from the saved button
          this.isRecipeSaved = false;
        }, err => {
          this.errorToast(err.error.message);
        });
      }
    }

    this.savedRecipesService.saveRecipe(this.recipe.id).pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe(res => {
      // add recipeId for change detection
      this.recipe.savedRecipes.unshift({ userId: this.user.id});

      // This adds the highlight from the saved button
      this.isRecipeSaved = true;
    }, err => {
      this.errorToast(err.error.message);
    });
  }

  // A function to reduce the amount of code shown for toasts
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

  // This checks savedMeals when the page loads
  checkSaved() {
    if (this.user) {
      for (let saved of this.recipe.savedRecipes) {
        if (saved.userId === this.user.id) {
          this.isRecipeSaved = true;
        }
      }
    }
  }
}
