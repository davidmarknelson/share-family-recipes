import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// Toast
import { toast } from 'bulma-toast';
// Services
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
  @Input() recipeId: number;
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

    for (let i = 0; i < this.user.savedRecipes.length; i++) {
      if (this.recipeId === this.user.savedRecipes[i].mealId) {
        return this.savedRecipesService.unsaveRecipe(this.recipeId).pipe(
          takeUntil(this.ngUnsubscribe)
        ).subscribe(res => {
          // remove recipeId for change detection
          this.user.savedRecipes.splice(i, 1);

          // This removes the highlight from the saved button
          this.isRecipeSaved = false;
        }, err => {
          this.errorToast(err.error.message);
        });
      }
    }

    this.savedRecipesService.saveRecipe(this.recipeId).pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe(res => {
      // add recipeId for change detection
      this.user.savedRecipes.unshift({ mealId: this.recipeId});

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
      for (let saved of this.user.savedRecipes) {
        if (saved.mealId === this.recipeId) {
          this.isRecipeSaved = true;
        }
      }
    }
  }
}
