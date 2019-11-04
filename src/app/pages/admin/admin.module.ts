import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin-routing.module';
// Pagination
import { PaginationModule } from '../../partials/pagination/pagination.module';
// Font Awesome
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [AdminComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    // Pagination
    PaginationModule,
    // Font Awesome
    FontAwesomeModule
  ]
})
export class AdminModule { }
