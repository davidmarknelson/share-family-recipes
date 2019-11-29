import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-recipe-view',
  templateUrl: './recipe-view.component.html',
  styleUrls: ['./recipe-view.component.scss']
})
export class RecipeViewComponent implements OnInit {
  recipeId: number;

  constructor(
    private route: ActivatedRoute, 
    private router: Router
  ) { }

  ngOnInit() {
    this.recipeId = Number(this.route.snapshot.params['id']);
  }

}
