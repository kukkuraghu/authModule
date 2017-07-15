import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthServices } from './auth-services.service';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [],
  declarations: [],
  providers: [AuthServices]
})
export class AngularSocialAuthModule { }
