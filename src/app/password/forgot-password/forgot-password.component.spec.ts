import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPasswordComponent } from './forgot-password.component';
import { PasswordModule } from '../password.module';
import { RouterTestingModule } from '@angular/router/testing';
import { PasswordService } from '../../services/password/password.service';

class MockPasswordService {

}

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        PasswordModule,
        RouterTestingModule
      ]
    })
    .overrideComponent(ForgotPasswordComponent, {
      set: {
        providers: [
          { provide: PasswordService, useClass: MockPasswordService }
        ]
      } 
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
