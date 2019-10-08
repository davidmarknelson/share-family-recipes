import { Component, OnInit } from '@angular/core';
// Services
import { AuthService } from '../services/auth/auth.service';
import { format } from 'date-fns';
import { User } from '../services/auth/user';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: User;
  
  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.getUserProfile();
  }

  getUserProfile() {
    this.auth.getProfile().subscribe(res => {
      this.user = this.createUserObject(res);
    });
  }

  createUserObject(response) {
    let user = response;
    user.createdAt = this.formatDate(user.createdAt);
    user.updatedAt = this.formatDate(user.updatedAt);
    user.profilePic = this.checkProfilePic(user.profilePic);
    return user;
  }

  formatDate(date) {
    return format(new Date(date), 'MMM dd, yyyy');
  }

  checkProfilePic(picture) {
    if (picture) {
      return `${environment.apiUrl}${picture}`;
    } else {
      return '../../assets/images/default-img/default-profile-pic.jpg';
    }
  }
}
