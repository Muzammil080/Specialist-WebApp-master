
import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import { MaterialModule } from "../material/material.module";
import {  SpecialistComponent } from "./specialist.component";
import { OrderModule } from 'ngx-order-pipe';
//import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { PipelModule } from "../pipes/pipe.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
    imports : [MaterialModule,OrderModule,PipelModule,FormsModule,ReactiveFormsModule],
    declarations: [SpecialistComponent],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class  SpecialistModule {

}