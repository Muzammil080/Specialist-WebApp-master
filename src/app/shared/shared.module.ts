import { MaterialModule } from ".././material/material.module";
import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { NavComponent } from "./nav/nav.component";
import { SpinComponent } from "./spin/spin.component";
import { BrowserModule } from "@angular/platform-browser";
import { ToastComponent } from "./toast/toast.component";
import { MsgBoxComponent } from "./msgbox/msgbox.component";
import { MsgDialog } from "./msgbox/msgdialog.component";
import { PipelModule } from "../pipes/pipe.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EqualValidator } from './directives/equal-validator.directive';
//import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';

@NgModule({
    imports : [MaterialModule, BrowserModule,FormsModule,ReactiveFormsModule,PipelModule],
    declarations : [EqualValidator, NavComponent, SpinComponent, ToastComponent, MsgBoxComponent, MsgDialog],
    exports : [NavComponent, SpinComponent, ToastComponent, MsgBoxComponent, MsgDialog],
    entryComponents : [MsgDialog],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class SharedModule {
}