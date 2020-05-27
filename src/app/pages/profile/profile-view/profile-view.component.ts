import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { Observable } from "rxjs";
// Interfaces
import { UserProfile } from "@utilities/interfaces/user-profile";
// Facades
import { UserFacadeService } from "@facades/user-facade/user-facade.service";

@Component({
	selector: "app-profile-view",
	templateUrl: "./profile-view.component.html",
	styleUrls: ["./profile-view.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileViewComponent implements OnInit {
	user$: Observable<UserProfile> = this.userFacades.user$;

	constructor(private userFacades: UserFacadeService) {}

	ngOnInit() {}
}
