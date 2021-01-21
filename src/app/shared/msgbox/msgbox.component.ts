import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MatDialog } from "@angular/material";

import { UIService } from "../../core/services/ui/ui.service";
import { MsgDialog } from "./msgdialog.component";

@Component({
    selector: 'msg-box',
    moduleId: module.id,
    template : ''
})
export class MsgBoxComponent implements OnInit, OnDestroy {

    onOkClick: (result,id) => any;
    onCancelClick: () => any;

    constructor(private _uiService: UIService, private dialog: MatDialog) { }

    ngOnInit(): void {
        this._uiService.messageBoxStatus.subscribe(
            (msg) => {

                if(msg.msg == "_cls")
                {
                    this.dialog.closeAll();
                    return;
                }

                this.onOkClick = msg.onOkBtnClick;
                this.onCancelClick = msg.onCancelBtnClick;

                let dialogRef: MatDialogRef<MsgDialog>;


                dialogRef = this.dialog.open(MsgDialog);
                dialogRef.componentInstance.title = msg.title;
                dialogRef.componentInstance.msg = msg.msg;
                dialogRef.componentInstance.okBtnTitle = msg.okBtnTitle;
                dialogRef.componentInstance.cancelBtnTitle = msg.cancelBtnTitle;
                dialogRef.componentInstance.showInput=msg.showInput;
                dialogRef.componentInstance.selectedDatesWorkingDay=msg.selectedDatesWorkingDay;
                dialogRef.componentInstance.imageUrl = msg.imageUrl;

                return dialogRef.afterClosed().subscribe(
                    (result) => {

                        if(result && this.onOkClick)
                            this.onOkClick(result,msg.msg);
                        else if (this.onCancelClick)
                            this.onCancelClick();
                    }
                )
            }
        )
    }
    ngOnDestroy(): void {
        this._uiService.messageBoxStatus.unsubscribe();
    }
}
