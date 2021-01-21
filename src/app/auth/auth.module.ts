import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MaterialModule } from "../material/material.module";
import { LoginComponent } from "./login/login.component";
import { PasswordResetComponent } from "./passwordreset/passwordreset.component";
import { PasswordResetCompletionComponent } from "./passwordresetcompletion/passwordresetcompletion.component";
import { RegistrationComponent } from "./registration/registration.component";
import { VerificationComponent } from "./verfication/verification.component";
import { CompletationComponent } from "./completation/completation.component";
import { AuthService } from '../core/services/auth/auth.service';

import { SharedModule } from "../shared/shared.module";

import { PasswordStrengthBarModule } from 'ng2-password-strength-bar';
import { TextMaskModule } from 'angular2-text-mask';
import { ResponsiveModule } from 'ng2-responsive';
import { AddressModule } from './../address/address.module';
@NgModule({
    imports : [AddressModule,RouterModule,TextMaskModule, ReactiveFormsModule, FormsModule, MaterialModule, SharedModule, PasswordStrengthBarModule,ResponsiveModule],
    declarations : [LoginComponent,
        PasswordResetComponent,
        PasswordResetCompletionComponent,
        RegistrationComponent,
        VerificationComponent,
        CompletationComponent],
    providers: [AuthService],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AuthModule {

}
