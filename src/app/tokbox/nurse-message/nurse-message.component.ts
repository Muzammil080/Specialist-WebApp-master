import { Component, OnInit, Inject } from '@angular/core';
import { NurseMessageService } from '../../core/services/nurse/nurse.message.services';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Message } from '../../core/models/message';
import { UIService } from '../../core/services/ui/ui.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-nurse-message',
    templateUrl: './nurse-message.component.html',
    styleUrls: ['./nurse-message.component.css']
})
export class NurseMessageComponent implements OnInit {
    alertMessage;
    hiddenSaveLoader = true;

    form: FormGroup = new FormGroup({
        message: new FormControl({ value: '' }, [
            Validators.required,
            Validators.maxLength(255)
        ])
    });


    constructor(
        public dialogRef: MatDialogRef<NurseMessageComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _msgService: NurseMessageService,
        private _uiService: UIService
    ) { }
    ngOnInit() {
        this.form.controls['message'].setValue('');
    }
    SendMessage() {
        this.hiddenSaveLoader = false;
        this.alertMessage = this.form.controls['message'].value;
        this._msgService.MessageToNurse(this.data, this.alertMessage).subscribe(
            result => {
                this.hiddenSaveLoader = true;
                console.log(result);
                this.dialogRef.close();
                const success = new Message();
                success.msg = 'Message Sent';
                success.type = 'success';
                success.iconType = 'done';
                this._uiService.showToast(success);
            },
            err => {
                const message = new Message();
                message.msg = err._body;
                message.type = 'danger';
                message.iconType = 'error';
                if (err.status === 401) {
                    message.msg = 'Login session expired';
                }
                this._uiService.showToast(message);
                this.hiddenSaveLoader = true;
            }
        );
    }
}
