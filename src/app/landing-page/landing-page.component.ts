import { Component, OnInit } from '@angular/core';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  faChevronDown = faChevronDown;

  constructor() { }

  ngOnInit() {
  }

  scroll() {
    window.scrollTo({ top: 400, behavior: 'smooth' });
  }
}
