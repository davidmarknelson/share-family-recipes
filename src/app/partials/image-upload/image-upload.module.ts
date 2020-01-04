import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageUploadComponent } from './image-upload.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [ImageUploadComponent],
  imports: [
    CommonModule,
    FontAwesomeModule
  ],
  exports: [ImageUploadComponent]
})
export class ImageUploadModule { }
