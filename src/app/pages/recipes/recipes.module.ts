import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecipesRoutingModule } from './recipes-routing.module';
import { RecipeBrowseComponent } from './recipes-browse/recipe-browse.component';
import { RecipeViewComponent } from './recipe-view/recipe-view.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
// Pipes
import { SafeUrlPipe } from '../../utilities/pipes/safe-url/safe-url.pipe';

@NgModule({
    declarations: [RecipeBrowseComponent, RecipeViewComponent, SafeUrlPipe],
  imports: [
    CommonModule,
    RecipesRoutingModule,
    FontAwesomeModule
  ]
})
export class RecipesModule { }