import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { RecipeBrowseComponent } from "./recipes-browse/recipe-browse.component";
import { RecipeViewComponent } from "./recipe-view/recipe-view.component";
import { UserRecipesComponent } from "./user-recipes/user-recipes.component";
import { SavedBrowseComponent } from "./saved-browse/saved-browse.component";
import { AuthGuard } from "../../utilities/guards/auth/auth.guard";

const routes: Routes = [
	{ path: "", component: RecipeBrowseComponent },
	{ path: "user-recipes", component: UserRecipesComponent },
	{
		path: "saved-list",
		component: SavedBrowseComponent,
		canActivate: [AuthGuard],
	},
	{ path: ":recipe", component: RecipeViewComponent },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class RecipesRoutingModule {}
