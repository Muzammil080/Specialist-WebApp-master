import { NgModule ,CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { BrowserModule } from "../../../node_modules/@angular/platform-browser";

import { DynamicFormsModule } from "../../dynamic-forms-fw/dynamic-forms-fw.module";
import {AddressComponent} from "./address.component"
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from "../material/material.module";

@NgModule({
    imports : [MaterialModule, BrowserModule, DynamicFormsModule ,FormsModule, ReactiveFormsModule],
    declarations: [ AddressComponent ],
    providers : [  ],
    exports : [ AddressComponent ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AddressModule {

}