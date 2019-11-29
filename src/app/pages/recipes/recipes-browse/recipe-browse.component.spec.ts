import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeBrowseComponent } from './recipe-browse.component';

describe('RecipeBrowseComponent', () => {
  let component: RecipeBrowseComponent;
  let fixture: ComponentFixture<RecipeBrowseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecipeBrowseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeBrowseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
