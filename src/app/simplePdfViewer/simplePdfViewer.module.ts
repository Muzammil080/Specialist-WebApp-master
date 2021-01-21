
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { MaterialModule } from "../material/material.module";
import { SimplePdfViewerComponent } from "./simplePdfViewer.component";
import { OrderModule } from 'ngx-order-pipe';
//import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { PipelModule } from "../pipes/pipe.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddressComponent } from '../address/address.component';
import { DynamicNotesModule } from '../dyanmic-notes/dynamic.notes.module';

import { PacsModule } from "../pacs/pacs.module";
import { DeferChatModule } from "../deferchat/deferChat.module";
import { PdfViewerModule } from 'ng2-pdf-viewer';
@NgModule({
    imports: [PdfViewerModule,DeferChatModule, PacsModule, MaterialModule, OrderModule, PipelModule, FormsModule, ReactiveFormsModule, DynamicNotesModule],
    declarations: [SimplePdfViewerComponent],
    entryComponents: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SimplePdfViewerModule {

}