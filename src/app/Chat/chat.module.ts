import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { MaterialModule } from "../material/material.module";
import { ChatComponent } from "./chat.component";

import { SpecialistChatComponent } from "./specialistchat/specialist-chat.component";
//import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { OrderModule } from 'ngx-order-pipe';
import { DeferChatModule } from "../deferchat/deferChat.module";
import { PipelModule } from "../pipes/pipe.module";

@NgModule({
    imports: [DeferChatModule, MaterialModule, FormsModule, ReactiveFormsModule, OrderModule,PipelModule],
    declarations: [ChatComponent, SpecialistChatComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ChatModule {

}
