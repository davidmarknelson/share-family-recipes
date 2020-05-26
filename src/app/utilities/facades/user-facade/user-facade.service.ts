import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";
import { AuthService } from "@utilities/services/auth/auth.service";
import { UserProfile } from "@utilities/interfaces/user-profile";
import { Router } from "@angular/router";

const enum UserActionTypes {
	UPDATE_LOG_IN = "Update user log in",
	UPDATE_USER = "Update user"
}

interface UserAction {
	readonly type: UserActionTypes;
	readonly payload: UserProfile | null | boolean;
}

class UserState {
	constructor(isLoggedIn) {
		this.isLoggedIn = isLoggedIn;
	}
	isLoggedIn: boolean;
	user: UserProfile = null;
}

const reduce = (state: UserState, action: UserAction) => {
	switch (action.type) {
		case UserActionTypes.UPDATE_LOG_IN:
			return {
				...state,
				isLoggedIn: action.payload as boolean
			};
		case UserActionTypes.UPDATE_USER:
			return {
				...state,
				user: action.payload as UserProfile
			};
	}
};

@Injectable({
	providedIn: "root"
})
export class UserFacadeService {
	private state = new UserState(this.auth.isLoggedIn());
	private dispatch = new BehaviorSubject<UserState>(this.state);

	user$: Observable<UserProfile> = this.dispatch
		.asObservable()
		.pipe(map(state => state.user));

	isLoggedIn$: Observable<boolean> = this.dispatch
		.asObservable()
		.pipe(map(state => state.isLoggedIn));

	constructor(private auth: AuthService, private router: Router) {
		if (this.state.isLoggedIn) this.getUser();
	}

	logoutUser(): void {
		this.updateLogginState(false);
		this.updateUserState(null);
		this.auth.logout();
		this.router.navigate(["/"]);
	}

	getUser(): void {
		this.auth.getProfile$().subscribe(res => this.updateUserState(res));
	}

	updateLogginState(loggedIn: boolean): void {
		this.dispatch.next(
			(this.state = reduce(this.state, {
				type: UserActionTypes.UPDATE_LOG_IN,
				payload: loggedIn
			}))
		);
	}

	updateUserState(user: UserProfile): void {
		this.dispatch.next(
			(this.state = reduce(this.state, {
				type: UserActionTypes.UPDATE_USER,
				payload: user
			}))
		);
	}
}
