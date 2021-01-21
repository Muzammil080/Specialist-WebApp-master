
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { CommonModule } from '@angular/common';
import { DeferChatComponent } from './deferChat.component';
import { MaterialModule } from "../material/material.module";

import { SplitAuthorPipe, SplitPipe } from './split.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { OrderModule } from 'ngx-order-pipe';
@NgModule({
    imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule, OrderModule],
    declarations: [DeferChatComponent, SplitPipe, SplitAuthorPipe],
    exports: [DeferChatComponent, SplitPipe, SplitAuthorPipe],
    entryComponents: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DeferChatModule {

}