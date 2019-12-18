import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../utilities/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  showMenu: boolean = false;
  isLoggedIn: boolean;

  constructor(private auth: AuthService, private router: Router) {
    this.auth.loggedIn.subscribe(status => this.isLoggedIn = status);
  }

  ngOnInit() {
    this.isLoggedIn = this.auth.isLoggedIn();
    this.renewToken();
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  renewToken() {
    if (this.isLoggedIn) {
      this.auth.renewToken().subscribe();
    } else {
      localStorage.clear();
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
