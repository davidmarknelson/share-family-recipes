import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PaginationComponent } from './pagination.component';

let fixture: ComponentFixture<PaginationComponent>;
let previousBtn: DebugElement;
let nextBtn: DebugElement;
let firstPageBtn: DebugElement;
let lastPageBtn: DebugElement;
let firstEllipsis: DebugElement;
let secondEllipsis: DebugElement;

function selectElements() {
  previousBtn = fixture.debugElement.query(By.css('.pagination-previous'));
  nextBtn = fixture.debugElement.query(By.css('.pagination-next'));
  firstPageBtn = fixture.debugElement.query(By.css('[data-test=first-page]'));
  lastPageBtn = fixture.debugElement.query(By.css('[data-test=last-page]'));
  firstEllipsis = fixture.debugElement.query(By.css('[data-test=first-ellipsis]'));
  secondEllipsis = fixture.debugElement.query(By.css('[data-test=second-ellipsis]'));
}

describe('PaginationComponent', () => {
  let component: PaginationComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaginationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
  });


  describe('initialization', () => {
    beforeEach(() => {
      spyOn(component, 'getPages').and.callThrough();
      component.count = 200;
      component.offset = 0;
      component.limit = 10;
      fixture.detectChanges();
      selectElements();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
  
    it('should call getPages() when it initializes', () => {
      expect(component.getPages).toHaveBeenCalled();
    });
  });

  describe('large count', () => {
    beforeEach(() => {
      component.count = 200;
      component.offset = 0;
      component.limit = 10;
      fixture.detectChanges();
      selectElements();
    });
      
    it('should not show a previous button when on page one', () => {  
      expect(previousBtn.nativeElement.disabled).toEqual(true);
      expect(nextBtn).toBeTruthy();
    });
  
    it('should show both ellipsis', () => {
      expect(firstEllipsis).toBeFalsy();
      expect(secondEllipsis).toBeTruthy();
      expect(lastPageBtn.nativeElement.innerText).toEqual('20');
    });
  });

  describe('small count', () => {
    beforeEach(() => {
      component.count = 20;
      component.offset = 0;
      component.limit = 10;
      fixture.detectChanges();
      selectElements();
    });
      
    it('should not show a previous button when on page one', () => {
      expect(previousBtn.nativeElement.disabled).toEqual(true);
      expect(nextBtn).toBeTruthy();
    });
  
    it('should not show the ellipsis', () => {
      expect(firstEllipsis).toBeFalsy();
      expect(secondEllipsis).toBeFalsy();
      expect(lastPageBtn.nativeElement.innerText).toEqual('2');
    });
  });

  describe('last page', () => {
    beforeEach(() => {
      component.count = 20;
      component.offset = 10;
      component.limit = 10;
      fixture.detectChanges();
      selectElements();
    });

    it('should show the previous button when on the last page and highlight the last page button', () => {
      expect(previousBtn).toBeTruthy();
      expect(nextBtn.nativeElement.disabled).toEqual(true);
      expect(lastPageBtn.classes['is-current']).toEqual(true);     
    });
  });

  describe('pageChange emit', ()=> {
    beforeEach(() => {
      component.count = 200;
      component.offset = 100;
      component.limit = 10;
      fixture.detectChanges();
      selectElements();
    });

    it('should emit the page number when clicking on the page button', () => {
      spyOn(component.pageChange, 'emit');

      const page10 = fixture.debugElement.query(By.css('li:nth-child(3) > a'));

      expect(page10.nativeElement.innerText).toEqual('10');
      
      page10.nativeElement.click();
      fixture.detectChanges();

      expect(component.pageChange.emit).toHaveBeenCalledWith(90);
    });

    it('should emit the page number when clicking on the previous button', () => {
      spyOn(component.pageChange, 'emit');

      previousBtn.nativeElement.click();
      fixture.detectChanges();

      expect(component.pageChange.emit).toHaveBeenCalledWith(90);
    });

    it('should emit the page number when clicking on the next button', () => {
      spyOn(component.pageChange, 'emit');
      
      nextBtn.nativeElement.click();
      fixture.detectChanges();

      expect(component.pageChange.emit).toHaveBeenCalledWith(110);
    });
  });

  describe('page numbers', () => {
    it('should show 3 numbers for 3 pages', () => {
      component.count = 30;
      component.offset = 0;
      component.limit = 10;
      fixture.detectChanges();
      selectElements();

      const page2 = fixture.debugElement.query(By.css('li:nth-child(3)'));
      
      expect(firstPageBtn.nativeElement.innerText).toEqual('1');
      expect(page2.nativeElement.innerText).toEqual('2');
      expect(lastPageBtn.nativeElement.innerText).toEqual('3');
      expect(previousBtn.nativeElement.disabled).toEqual(true);
      expect(nextBtn).toBeTruthy();
    });

    it('should show 3 numbers for 4 pages', () => {
      component.count = 40;
      component.offset = 0;
      component.limit = 10;
      fixture.detectChanges();
      selectElements();

      const page2 = fixture.debugElement.query(By.css('li:nth-child(3)'));
      
      expect(firstPageBtn.nativeElement.innerText).toEqual('1');
      expect(page2.nativeElement.innerText).toEqual('2');
      expect(lastPageBtn.nativeElement.innerText).toEqual('4');
      expect(previousBtn.nativeElement.disabled).toEqual(true);
      expect(nextBtn).toBeTruthy();
      expect(secondEllipsis).toBeTruthy();
    });

    it('should show the first ellipsis when on the last page of 4 pages', () => {
      component.count = 40;
      component.offset = 30;
      component.limit = 10;
      fixture.detectChanges();
      selectElements();

      const page3 = fixture.debugElement.query(By.css('li:nth-child(3)'));
      
      expect(firstPageBtn.nativeElement.innerText).toEqual('1');
      expect(page3.nativeElement.innerText).toEqual('3');
      expect(lastPageBtn.nativeElement.innerText).toEqual('4');
      expect(previousBtn).toBeTruthy();
      expect(nextBtn.nativeElement.disabled).toEqual(true);
      expect(firstEllipsis).toBeTruthy();
      expect(secondEllipsis).toBeFalsy();
    });

    it('should not show the ellipsis when on the middle page of 5 pages', () => {
      component.count = 50;
      component.offset = 20;
      component.limit = 10;
      fixture.detectChanges();
      selectElements();

      const page3 = fixture.debugElement.query(By.css('li:nth-child(3)'));
      
      expect(firstPageBtn.nativeElement.innerText).toEqual('1');
      expect(page3.nativeElement.innerText).toEqual('3');
      expect(lastPageBtn.nativeElement.innerText).toEqual('5');
      expect(previousBtn).toBeTruthy();
      expect(nextBtn).toBeTruthy();
      expect(firstEllipsis).toBeFalsy();
      expect(secondEllipsis).toBeFalsy();
    });
  });
});
