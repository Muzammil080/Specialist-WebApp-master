import { Component, OnInit, Inject, OnDestroy, AfterViewInit } from '@angular/core'

import { MatDialogRef, MatDialog } from "@angular/material";
import { StatusService } from '../core/services/user/status.service';
import { MatTabChangeEvent } from '@angular/material';
@Component({
    selector: 'chat',
    moduleId: module.id,
    templateUrl: 'chat.component.html',
    // styleUrls: ['chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {

    DeferredMsgs:boolean = false;
    deferredLoad:boolean = false;
    Chat:boolean = false;

    constructor(private _statusService: StatusService) { }


    tabChange(event: MatTabChangeEvent) {
 
        if (event.index == 1) {
            this.deferredLoad=true;
        }else{
            this.deferredLoad=false;
        }
      }

    ngOnInit(): void {

        this._statusService.getpermissionCodes().subscribe(res => {
            if (res) {
                this.DeferredMsgs = res.DeferredMsgs;
                this.Chat = res.Chat;
            }
        });
    }
    ngOnDestroy() {

    }

}

