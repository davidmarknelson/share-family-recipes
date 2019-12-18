import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecipeBrowseComponent } from './recipes-browse/recipe-browse.component'
import { RecipeViewComponent } from './recipe-view/recipe-view.component';
import { UserRecipesComponent } from './user-recipes/user-recipes.component'

const routes: Routes = [
  { path: '', component: RecipeBrowseComponent },
  { path: 'user-recipes', component: UserRecipesComponent },
  { path: ':recipe', component: RecipeViewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecipesRoutingModule { }
