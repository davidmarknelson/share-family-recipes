import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailMessageComponent } from './email-message.component';

describe('EmailMessageComponent', () => {
  let component: EmailMessageComponent;
  let fixture: ComponentFixture<EmailMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
