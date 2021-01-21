import { Component, OnDestroy, OnInit } from '@angular/core';
import { UIService } from "../../core/services/ui/ui.service";
import { MessageTypes } from "../../core/models/message";
@Component({
    selector: 'toast',
    moduleId : module.id,
    templateUrl : './toast.component.html',
    styleUrls : ['./toast.component.css']
})
export class ToastComponent implements OnInit, OnDestroy {
    
    title = 'Veemed';
    msg = 'It is working!';
    iconType = 'info';
    opacity = 0;
    zIndex = 0;
    theme :any;
    type: string;
    constructor(private _uiService : UIService){}
    ngOnInit(): void {
        this._uiService.toastStatus.subscribe(
            (msg) => {

               
                //set title and msg
                this.title = msg.title;
                this.msg = msg.msg;
                this.iconType = msg.iconType;
                this.opacity = 1;
                this.zIndex = 9999;
                this.type = msg.type
                window.setTimeout(() => {
                   this.opacity = 0;
                   this.zIndex = 0;
                }, 4000)
            },
            (err) =>{}
        );
    }
    ngOnDestroy(): void {
        this._uiService.toastStatus.unsubscribe();
    }
}