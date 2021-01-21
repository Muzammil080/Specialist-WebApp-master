
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { MaterialModule } from "../material/material.module";

import { OrderModule } from 'ngx-order-pipe';
//import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { PipelModule } from "../pipes/pipe.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PasswordStrengthBarModule } from 'ng2-password-strength-bar';
import { TextMaskModule } from 'angular2-text-mask';
import { AddressModule } from '../address/address.module';
import { UserManagementComponent } from "./userManagement.component";
import { QualityMetricsComponent } from "./qualityMetrics/qualityMetrics.component";
import { ProfileComponent } from "./profile/profile.component";
import { PaymentsComponent } from "./payments/payments.component";
import { ChangePassComponent } from "./changePass/changePass.component";

@NgModule({
    imports: [AddressModule, MaterialModule, OrderModule, TextMaskModule, PipelModule, FormsModule, ReactiveFormsModule, PasswordStrengthBarModule],
    declarations: [UserManagementComponent,QualityMetricsComponent,ProfileComponent,PaymentsComponent,ChangePassComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UserManagementModule {

}