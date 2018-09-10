import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AngularMaterialModule } from '../angular-material.module';
import { AuthRoutingModule } from './auth-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    FormsModule, // ngModel을 쓰기 위함. core에 포함이 안되고 @angular/forms에 포함되어 있음
    AuthRoutingModule,
    FlexLayoutModule
  ]
})
export class AuthModule {}

