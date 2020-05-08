import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subject, Observable } from "rxjs";
import { takeUntil } from "rxjs/operators";
// Services
import { SavedRecipesService } from "../../../utilities/services/saved-recipes/saved-recipes.service";
import { UserRecipeCardInfo } from "../../../utilities/interfaces/user-recipe-card-info";
import { AuthService } from "../../../utilities/services/auth/auth.service";
import { UserDecodedToken } from "../../../utilities/interfaces/user-decoded-token";

@Component({
	selector: "app-saved-browse",
	templateUrl: "./saved-browse.component.html",
	styleUrls: ["./saved-browse.component.scss"],
})
export class SavedBrowseComponent implements OnInit, OnDestroy {
	private ngUnsubscribe = new Subject();
	// =============
	recipes: UserRecipeCardInfo;
	errorMessage: string;
	// This is used to show 'Getting data...'
	isLoading: boolean;
	user: UserDecodedToken;
	username: string;
	// Sorting
	sortingOption: string = "savedRecipesAtoZ";
	// pagination
	offset: number = 0;
	limit: number = 9;
	initialPageRecipeNumber: number;
	finalPageRecipeNumber: number;
	// Select amount of recipes to show
	recipesShown: Array<number> = [9, 18];

	constructor(
		private savedService: SavedRecipesService,
		private authService: AuthService
	) {}

	ngOnInit() {
		this.isLoading = true;
		this.user = this.authService.currentUser();

		this.getData(this.sortingOption, this.offset, this.limit);
	}

	ngOnDestroy() {
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}

	data: Object = {
		savedRecipesAtoZ: (offset, limit) =>
			this.savedService.savedRecipesAtoZ(offset, limit),
		savedRecipesZtoA: (offset, limit) =>
			this.savedService.savedRecipesZtoA(offset, limit),
	};

	// A function to get the data depending of which sorting option was sent
	getData(sortingOption, offset, limit): Observable<UserRecipeCardInfo> {
		return this.data[sortingOption](offset, limit)
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe(
				(res: UserRecipeCardInfo) => {
					this.errorMessage = "";
					this.isLoading = false;
					this.recipes = res;
					this.pageRecipeNumbers(this.offset, this.limit);
				},
				err => {
					this.isLoading = false;
					this.errorMessage = err.error.message;
				}
			);
	}

	// Change how to sort the recipes
	onSortingChange(value: string): Observable<UserRecipeCardInfo> {
		if (value === "A - Z") {
			this.sortingOption = "savedRecipesAtoZ";
		} else {
			this.sortingOption = "savedRecipesZtoA";
		}

		return this.getData(this.sortingOption, this.offset, this.limit);
	}

	// Pagination inputs
	onPageChange(offset: number) {
		this.offset = offset;

		return this.getData(this.sortingOption, this.offset, this.limit);
	}

	// Shows the numbers of the recipes shown in the table
	pageRecipeNumbers(offset, limit) {
		this.initialPageRecipeNumber = offset + 1;
		let finalNumber = offset + limit;
		if (finalNumber > this.recipes.count) {
			finalNumber = this.recipes.count;
		}
		this.finalPageRecipeNumber = finalNumber;
	}

	// This is called when the user changes the number
	// of recipes shown from the select input
	onAmountChange(value) {
		// the first 5 characters for value are 'Show '
		this.limit = Number(value.slice(5));
		this.offset = 0;
		return this.getData(this.sortingOption, this.offset, this.limit);
	}

	clearErrorMessage() {
		this.errorMessage = "";
	}
}
