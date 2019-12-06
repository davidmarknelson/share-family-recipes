import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SavedRecipeButtonComponent } from './saved-recipe-button.component';


@NgModule({
  declarations: [SavedRecipeButtonComponent],
  imports: [
    CommonModule
  ],
  exports: [SavedRecipeButtonComponent]
})
export class SavedRecipeButtonModule { }
