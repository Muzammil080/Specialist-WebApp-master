import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PatientInfo } from '../../core/services/specialist/patientinfo.service';

@Component({
    selector: 'app-patient-info',
    templateUrl: './patient-info.component.html',
    styleUrls: ['./patient-info.component.css']
})
export class PatientInfoComponent implements OnInit {
    patientInfo: PatientInfo;

    constructor(
        public dialogRef: MatDialogRef<PatientInfoComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.patientInfo = data;
    }

    ngOnInit() {
    }

    close() {
        this.dialogRef.close();
    }

}
