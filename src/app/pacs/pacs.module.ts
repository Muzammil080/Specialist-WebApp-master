
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PacsComponent } from './pacs.component';
import { CommonModule } from '@angular/common';
//import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';

@NgModule({
    imports: [CommonModule],
    declarations: [PacsComponent],
    exports: [PacsComponent],
    entryComponents: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PacsModule {
}