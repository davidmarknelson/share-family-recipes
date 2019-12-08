import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecipeCreateComponent } from './recipe-create/recipe-create.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { AuthGuard } from '../../utilities/guards/auth/auth.guard';

const routes: Routes = [
  { path: '', component: RecipeCreateComponent },
  { path: 'edit', component: RecipeEditComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecipeRoutingModule { }
