import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '../services/auth/auth.service';
import { ProfileComponent } from './profile.component';
import { of } from 'rxjs';

class MockAuthService {
  getProfile() {
    return of();
  }
}

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileComponent ],
      providers: [
        { provide: AuthService, useClass:  MockAuthService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
