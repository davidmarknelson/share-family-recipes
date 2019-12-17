import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeCardsComponent } from './recipe-cards.component';
import { LikesButtonModule } from '../likes-button/likes-button.module';
import { SavedRecipeButtonModule } from '../saved-recipe-button/saved-recipe-button.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [RecipeCardsComponent],
  imports: [
    CommonModule,
    LikesButtonModule,
    SavedRecipeButtonModule,
    FontAwesomeModule
  ],
  exports: [RecipeCardsComponent]
})
export class RecipeCardsModule { }
