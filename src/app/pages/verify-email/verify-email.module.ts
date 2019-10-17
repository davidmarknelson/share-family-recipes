import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VerifyEmailRoutingModule } from './verify-email-routing.module';
import { VerifyEmailComponent } from './verify-email.component';


@NgModule({
  declarations: [VerifyEmailComponent],
  imports: [
    CommonModule,
    VerifyEmailRoutingModule
  ]
})
export class VerifyEmailModule { }
