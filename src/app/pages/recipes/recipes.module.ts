import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecipesRoutingModule } from './recipes-routing.module';
import { RecipeBrowseComponent } from './recipes-browse/recipe-browse.component';
import { RecipeViewComponent } from './recipe-view/recipe-view.component';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LikesButtonModule } from '../../partials/likes-button/likes-button.module';
import { SavedRecipeButtonModule } from '../../partials/saved-recipe-button/saved-recipe-button.module';
import { PaginationModule } from '../../partials/pagination/pagination.module';
import { RecipeCardsModule } from '../../partials/recipe-cards/recipe-cards.module';
// Pipes
import { SafeUrlPipe } from '../../utilities/pipes/safe-url/safe-url.pipe';
import { UserRecipesComponent } from './user-recipes/user-recipes.component';

@NgModule({
  declarations: [RecipeBrowseComponent, RecipeViewComponent, SafeUrlPipe, UserRecipesComponent],
  imports: [
    CommonModule,
    RecipesRoutingModule,
    FontAwesomeModule,
    LikesButtonModule,
    SavedRecipeButtonModule,
    RecipeCardsModule,
    FormsModule,
    PaginationModule
  ]
})
export class RecipesModule { }
