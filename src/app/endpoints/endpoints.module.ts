
import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import { MaterialModule } from "../material/material.module";
import { EndPointsComponent } from "./endpoints.component";
// import{ SessionHistoryComponent } from "./Session History/sessionhistory.component";
import{ VirutalEndpointComponent } from "./virutalendpoint/virutalendpoint.component";
import { OrderModule } from 'ngx-order-pipe';
import { PipelModule } from "../pipes/pipe.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
@NgModule({
    imports : [MaterialModule,OrderModule,PipelModule,FormsModule, ReactiveFormsModule],
    declarations: [EndPointsComponent,VirutalEndpointComponent],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class EndPointsModule {

}