import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { MaterialModule } from "../material/material.module";
import { PacsiosComponent } from "./pacsios.component";
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
//import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';

@NgModule({
    imports : [MaterialModule,FormsModule,ReactiveFormsModule],
    declarations: [PacsiosComponent],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class PacsiosModule {

}