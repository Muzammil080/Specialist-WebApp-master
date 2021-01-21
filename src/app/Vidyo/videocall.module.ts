import {
  NgModule,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA
} from "@angular/core";
import { MaterialModule } from "../material/material.module";
import { VideoCallComponent } from "./videocall.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { PacsComponent } from "../pacs/pacs.component";
//import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { DynamicNotesModule } from "./../dyanmic-notes/dynamic.notes.module";
import { PacsModule } from "../pacs/pacs.module";

@NgModule({
  imports: [
    PacsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    DynamicNotesModule
  ],
  declarations: [VideoCallComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class VideoCallModule {}
