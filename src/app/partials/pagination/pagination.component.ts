import { Component, OnInit, EventEmitter, Output, Input, OnChanges } from '@angular/core';
import { range, Observable } from 'rxjs';
import { map, filter, toArray, tap } from 'rxjs/operators';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit, OnChanges {
  @Input() count: number;
  @Input() offset: number;
  @Input() limit: number;
  @Output() pageChange = new EventEmitter<number>();
  pageRange: number;
  currentPage: number;
  totalPages: number;
  pages: number[];

  constructor() { }

  ngOnInit() {
    this.getPages(this.offset, this.limit, this.count);
  }

  ngOnChanges() {
    this.getPages(this.offset, this.limit, this.count);
  }

  getPages(offset: number, limit: number, count: number) {
    this.currentPage = this.getCurrentPage(offset, limit);
    this.totalPages = this.getTotalPages(limit, count);
    range(this.currentPage - 1, 3).pipe(
      filter((page: number) => this.isValidPageNumber(page, this.totalPages)),
      toArray()
    ).subscribe(range => {
      this.pages = range;
      console.log(this.pages)
      console.log('finish')
    });
  }
  

  getCurrentPage(offset: number, limit: number): number {
    return Math.floor(offset / limit) + 1;
  }
  
  getTotalPages(limit: number, size: number): number {
    return Math.ceil(Math.max(size, 1) / Math.max(limit, 1));
  }

  isValidPageNumber(page: number, totalPages: number): boolean {
    return page > 0 && page <= totalPages;
  }
  
  emitPageNumber(page) {
    this.currentPage = page;
    this.pageChange.emit(this.limit * (page - 1));
  }
}
