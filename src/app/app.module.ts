import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ReactiveFormsModule } from "@angular/forms";
// Font Awesome
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
// Smooth Scroll
import { NgxPageScrollCoreModule } from "ngx-page-scroll-core";
import { NgxPageScrollModule } from "ngx-page-scroll";
// Components
import { LandingPageComponent } from "./pages/landing-page/landing-page.component";
import { NavbarComponent } from "./partials/navbar/navbar.component";
import { FooterComponent } from "./partials/footer/footer.component";
import { SearchBarComponent } from "@partials/search-bar/search-bar.component";
// JWT
import { JwtModule } from "@auth0/angular-jwt";
// Services
import { AuthInterceptorService } from "./utilities/interceptors/auth-interceptor.service";

export function tokenGetter() {
	return localStorage.getItem("authToken");
}

@NgModule({
	declarations: [
		AppComponent,
		LandingPageComponent,
		NavbarComponent,
		FooterComponent,
		SearchBarComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		HttpClientModule,
		// JWT
		JwtModule.forRoot({
			config: {
				tokenGetter
			}
		}),
		// Font Awesome
		FontAwesomeModule,
		// Smooth Scroll
		NgxPageScrollCoreModule,
		NgxPageScrollModule,
		// Forms
		ReactiveFormsModule
	],
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: AuthInterceptorService,
			multi: true
		}
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
