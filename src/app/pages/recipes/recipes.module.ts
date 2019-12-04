import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecipesRoutingModule } from './recipes-routing.module';
import { RecipeBrowseComponent } from './recipes-browse/recipe-browse.component';
import { RecipeViewComponent } from './recipe-view/recipe-view.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@NgModule({
  declarations: [RecipeBrowseComponent, RecipeViewComponent],
  imports: [
    CommonModule,
    RecipesRoutingModule,
    FontAwesomeModule
  ]
})
export class RecipesModule { }
