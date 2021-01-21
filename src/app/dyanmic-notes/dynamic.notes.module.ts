import { NgModule } from "@angular/core";
import { BrowserModule } from "../../../node_modules/@angular/platform-browser";
import { FormsModule } from '@angular/forms';
import { DynamicFormsModule } from "../../dynamic-forms-fw/dynamic-forms-fw.module";
import { DynamicNotesComponent } from "./dynamic-notes-component/dynamic.notes.component";
import { ClinicalNotesService } from "../core/services/clinical-notes/clinical.notes.service";
import { SimplePdfViewerComponent } from "../simplePdfViewer/simplePdfViewer.component";


@NgModule({
    imports : [ BrowserModule, DynamicFormsModule ,FormsModule ],
    declarations: [ DynamicNotesComponent ],
    providers : [ ClinicalNotesService ],
    exports : [ DynamicNotesComponent ],
    entryComponents: [SimplePdfViewerComponent]
})
export class DynamicNotesModule {

}