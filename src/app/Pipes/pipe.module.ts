import { NgModule } from "@angular/core";
import { SplitPipe, MyTimePipe } from "./split.pipe";
import { SpecilistPipe } from "./specilist.pipe";
import { NewDate } from "./newDate.pipe";
import { ChannelUser } from "./channelUser.pipe";



@NgModule({
    imports: [
        // dep modules
    ],
    declarations: [SplitPipe, MyTimePipe, SpecilistPipe, NewDate,ChannelUser],
    exports: [SplitPipe, MyTimePipe, SpecilistPipe, NewDate , ChannelUser]

})

export class PipelModule { }
