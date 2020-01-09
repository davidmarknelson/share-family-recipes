import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecipeRoutingModule } from './recipe-routing.module';
import { RecipeCreateComponent } from './recipe-create/recipe-create.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { ImageUploadModule } from '../../partials/image-upload/image-upload.module';

@NgModule({
  declarations: [RecipeCreateComponent, RecipeEditComponent],
  imports: [
    CommonModule,
    RecipeRoutingModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    ImageUploadModule
  ]
})
export class RecipeModule { }
