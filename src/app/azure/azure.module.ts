import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AzureLoginComponent } from './azure-login/azure-login.component';
import { MaterialModule } from '../material/material.module';
import { AuthService } from '../core/services/auth/auth.service';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AzureLogoutComponent } from './azure-logout/azure-logout.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [AzureLoginComponent, AzureLogoutComponent],
  providers: [AuthService]
})
export class AzureModule { }
