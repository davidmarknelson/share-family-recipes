import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecipeBrowseComponent } from './recipes-browse/recipe-browse.component'
import { RecipeViewComponent } from './recipe-view/recipe-view.component';

const routes: Routes = [
  { path: '', component: RecipeBrowseComponent },
  { path: ':id', component: RecipeViewComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecipesRoutingModule { }
