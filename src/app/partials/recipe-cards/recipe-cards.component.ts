import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { RecipeCardInfo } from '../../utilities/services/searches/recipe-card-info';
import { UserDecodedToken } from '../../utilities/services/auth/user-decoded-token';
// Font Awesome
import { faFireAlt, faClock, faChevronRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-recipe-cards',
  templateUrl: './recipe-cards.component.html',
  styleUrls: ['./recipe-cards.component.scss']
})
export class RecipeCardsComponent implements OnInit {
  @Input() recipes: RecipeCardInfo;
  @Input() user: UserDecodedToken;
  // Font Awesome
  faFireAlt = faFireAlt;
  faClock = faClock;
  faChevronRight = faChevronRight;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  goToRecipe(id) {
    this.router.navigate([`/recipes/${id}`]);
  }

  goToUsersRecipes(username) {
    this.router.navigateByUrl(`/recipes/user-recipes?username=${username}`);
  }
}
