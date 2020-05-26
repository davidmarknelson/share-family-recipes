import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
// Components
import { LandingPageComponent } from "@pages/landing-page/landing-page.component";

const routes: Routes = [
	{
		path: "",
		component: LandingPageComponent,
	},
	{
		path: "signup",
		loadChildren: () =>
			import("./pages/signup/signup.module").then(m => m.SignupModule),
	},
	{
		path: "profile",
		loadChildren: () =>
			import("./pages/profile/profile.module").then(m => m.ProfileModule),
	},
	{
		path: "verify",
		loadChildren: () =>
			import("./pages/verify-email/verify-email.module").then(
				m => m.VerifyEmailModule
			),
	},
	{
		path: "login",
		loadChildren: () =>
			import("./pages/login/login.module").then(m => m.LoginModule),
	},
	{
		path: "profile/admin",
		loadChildren: () =>
			import("./pages/admin/admin.module").then(m => m.AdminModule),
	},
	{
		path: "create",
		loadChildren: () =>
			import("./pages/recipe/recipe.module").then(m => m.RecipeModule),
	},
	{
		path: "recipes",
		loadChildren: () =>
			import("./pages/recipes/recipes.module").then(m => m.RecipesModule),
	},
	{
		path: "contact",
		loadChildren: () =>
			import("./pages/contact/contact.module").then(m => m.ContactModule),
	},
	{
		path: "notfound",
		loadChildren: () =>
			import("./pages/not-found/not-found.module").then(m => m.NotFoundModule),
	},
	{ path: "**", redirectTo: "/notfound" },
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, {
			scrollPositionRestoration: "enabled",
		}),
	],
	exports: [RouterModule],
})
export class AppRoutingModule {}
