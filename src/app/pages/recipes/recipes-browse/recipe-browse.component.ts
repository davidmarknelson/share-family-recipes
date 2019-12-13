import { Component, OnInit , OnDestroy} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// Services
import { RecipeService } from '../../../utilities/services/recipe/recipe.service';
// Font Awesome
import { faThumbsUp, faFireAlt, faClock, faChevronRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-recipe-browse',
  templateUrl: './recipe-browse.component.html',
  styleUrls: ['./recipe-browse.component.scss']
})
export class RecipeBrowseComponent implements OnInit {

  constructor(
    private router: Router, 
    private recipeService: RecipeService
  ) { }

  ngOnInit() {
  }

}
