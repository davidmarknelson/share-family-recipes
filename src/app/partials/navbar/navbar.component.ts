import { Component, OnInit } from "@angular/core";
import { share } from "rxjs/operators";
import { Observable } from "rxjs";
import { UserFacadeService } from "@facades/user-facade/user-facade.service";
import { UserProfile } from "@utilities/interfaces/user-profile";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

@Component({
	selector: "app-navbar",
	templateUrl: "./navbar.component.html",
	styleUrls: ["./navbar.component.scss"]
})
export class NavbarComponent implements OnInit {
	faSearch = faSearch;
	isMenuOpen: boolean = false;
	isSearchOpen: boolean = false;

	isLoggedIn$: Observable<boolean> = this.userFacade.isLoggedIn$.pipe(share());
	user$: Observable<UserProfile> = this.userFacade.user$.pipe(share());

	constructor(private userFacade: UserFacadeService) {}

	ngOnInit() {}

	toggleMenu() {
		this.isMenuOpen = !this.isMenuOpen;
	}

	toggleSearchBar() {
		this.isSearchOpen = !this.isSearchOpen;
	}

	closeSearchBar() {
		this.isSearchOpen = false;
	}

	onCompleteSearch(event: boolean) {
		if (event) this.closeSearchBar();
	}

	logout() {
		this.userFacade.logoutUser();
	}
}
