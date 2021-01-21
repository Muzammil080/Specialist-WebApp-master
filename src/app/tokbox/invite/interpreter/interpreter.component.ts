import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { InviteService } from "../../../core/services/invites/invite.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Message } from "../../../core/models/message";
import { UIService } from "../../../core/services/ui/ui.service";

@Component({
    selector: "app-interpreter",
    templateUrl: "./interpreter.component.html",
    styleUrls: ["./interpreter.component.css"],
})
export class InterpreterComponent implements OnInit {
    constructor(private inviteService : InviteService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _uiService:UIService,
        public dialogRef: MatDialogRef<InterpreterComponent>) {}

    ngOnInit() {
        this.getSupportedLanguages();
    }

    isLoading:boolean=false;
    languageId = 0;
    supportedLanguages;
    languageForm = new FormGroup({
        language: new FormControl("", [Validators.required]),
    });

    inviteInterpreter() {
        this.isLoading = true;
        const data: any = {};
        data.languageId = this.languageId;
        data.inviteType = {};
        data.inviteType.type = "Interpreter";

        if(sessionStorage.getItem('appointmentId')){
            const appointmentId = JSON.parse(
                sessionStorage.getItem('appointmentId')
            );
            data.sessionType = 'appointment';
            data.specialistRequestId = appointmentId;
        }else{
            data.sessionType = 'inpatient';
            data.specialistRequestId = this.data.specialistRequestId;
        }
        this.inviteService.sendInvite(data).subscribe(
            (res) => {
                this.isLoading = false;
                const msg = new Message();
                msg.msg = 'Invite sent';
                msg.type = 'success';
                msg.iconType = 'check_circle';
                this._uiService.showToast(msg);
                this.dialogRef.close();
            },
            (err) => {
                this.isLoading = false;
                if(err.status !== 0){

                    const msg = new Message();
                    msg.msg = err._body;
                    msg.type = 'error';
                    msg.iconType = 'check_circle';
                    this._uiService.showToast(msg);
                }

            }
        );
    }

    getSupportedLanguages() {
        console.log(this.data,"inter");
        this.isLoading = true;
        this.inviteService.GetSupportedLanguages(this.data.partnerSiteId).subscribe((res) => {
            this.supportedLanguages = JSON.parse(res._body);
            this.isLoading = false;
        });
    }
}
