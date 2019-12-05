import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LikesButtonComponent } from './likes-button.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@NgModule({
  declarations: [LikesButtonComponent],
  imports: [
    CommonModule,
    FontAwesomeModule
  ],
  exports: [LikesButtonComponent]
})
export class LikesButtonModule { }
