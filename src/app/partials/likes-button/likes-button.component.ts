import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { toast } from "bulma-toast";
// Font Awesome
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
// Services
import { Recipe } from "../../utilities/interfaces/recipe";
import { UserDecodedToken } from "../../utilities/interfaces/user-decoded-token";
import { LikesService } from "../../utilities/services/likes/likes.service";

@Component({
	selector: "app-likes-button",
	templateUrl: "./likes-button.component.html",
	styleUrls: ["./likes-button.component.scss"],
})
export class LikesButtonComponent implements OnInit, OnDestroy {
	private ngUnsubscribe = new Subject();
	faThumbsUp = faThumbsUp;
	isRecipeLiked: boolean;
	@Input() user: UserDecodedToken;
	@Input() recipe: Recipe;

	constructor(private likesService: LikesService) {}

	ngOnInit() {
		this.checkLikes();
	}

	ngOnDestroy() {
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}

	toggleLikes() {
		// show error is person is not signed in
		if (!this.user) {
			return this.errorToast("You must be signed in to do that.");
		}

		// Loop through array of likes to find user's id
		for (let i = 0; i < this.recipe.likes.length; i++) {
			if (this.recipe.likes[i].userId === this.user.id) {
				// Remove a like if the user is in the array of likes
				return this.likesService
					.removeLike(this.recipe.id)
					.pipe(takeUntil(this.ngUnsubscribe))
					.subscribe(
						res => {
							// remove userId for change detection
							this.recipe.likes.splice(i, 1);

							// This removes the highlight from the likes button
							this.isRecipeLiked = false;
						},
						err => {
							this.errorToast(err.error.message);
						}
					);
			}
		}

		this.likesService
			.addLike(this.recipe.id)
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe(
				res => {
					// add userId for change detection
					this.recipe.likes.unshift({ userId: this.user.id });

					// This adds the highlight from the likes button
					this.isRecipeLiked = true;
				},
				err => {
					this.errorToast(err.error.message);
				}
			);
	}

	// A function to reduce the amount of code shown for toasts
	errorToast(message) {
		toast({
			message: message,
			type: "is-danger",
			dismissible: true,
			duration: 5000,
			position: "top-center",
			closeOnClick: true,
			pauseOnHover: true,
		});
	}

	// This checks likes when the page loads
	checkLikes() {
		if (this.user) {
			for (let like of this.recipe.likes) {
				if (like.userId === this.user.id) {
					this.isRecipeLiked = true;
				}
			}
		}
	}
}
