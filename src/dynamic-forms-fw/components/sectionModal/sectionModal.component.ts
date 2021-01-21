import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Section } from '../../models/section';
import { ClinicalNotesService } from '../../../app/core/services/clinical-notes/clinical.notes.service';
import { Message } from '../../../app/core/models/message';
import { UIService } from '../../../app/core/services/ui/ui.service';

@Component({
    selector: 'app-sectionModal',
    templateUrl: './sectionModal.component.html',
    styleUrls: ['./sectionModal.component.css']
})
export class SectionModalComponent implements OnInit {
    selectedSection: Section;
    showloader = false;
    specialistRequestId: number;
    encounterType: string;
    clinicalNoteId: number;
    formSpecialityId: number;
    workflowInstanceId: number;
    hiddenSaveLoader = true;
    hiddenLoader = false;
    constructor(
        private _notesService: ClinicalNotesService,
        private _uiServices: UIService,
        public dialogRef: MatDialogRef<SectionModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.selectedSection = data.section;
        this.clinicalNoteId = data.clinicalNoteId;
        this.encounterType = data.encounterType;
        this.formSpecialityId = data.formSpecialityId;
        this.specialistRequestId = data.specialistRequestId;
        this.workflowInstanceId = data.workflowInstanceId;
    }

    ngOnInit() { }
    sectionDataReceived(event) {
        this.hiddenLoader = true;
        console.log(event);
    }
    onNoClick() {
        this.dialogRef.close();
    }
    onYesClick() {
        this.hiddenSaveLoader = false;
        if (this.workflowInstanceId) {
            this._notesService.saveWorkflowSectionValues(
                this.workflowInstanceId,
                this.clinicalNoteId,
                this.encounterType,
                true,
                this.selectedSection.id,
                this.selectedSection.form.value
            ).subscribe(
                res => {
                    let msg = new Message();
                    msg.msg = this.data.isRadiologySession
                        ? 'Reports saved successfully'
                        : 'Notes saved successfully';
                    msg.type = 'success';
                    msg.iconType = 'check_circle';
                    this._uiServices.showToast(msg);
                    this.dialogRef.close();
                },
                err => {
                    this.selectedSection.form.markAsDirty();
                    console.error(err);
                    this.hiddenSaveLoader = false;
                }
            );
        } else {
            this._notesService
                .saveSectionValues(
                    this.specialistRequestId,
                    this.clinicalNoteId,
                    this.encounterType,
                    true,
                    this.selectedSection.id,
                    this.selectedSection.form.value,
                    this.formSpecialityId
                )
                .subscribe(
                    res => {
                        let msg = new Message();
                        msg.msg = this.data.isRadiologySession
                            ? 'Reports saved successfully'
                            : 'Notes saved successfully';
                        msg.type = 'success';
                        msg.iconType = 'check_circle';
                        this._uiServices.showToast(msg);
                        this.dialogRef.close();
                    },
                    err => {
                        this.selectedSection.form.markAsDirty();
                        console.error(err);
                        this.hiddenSaveLoader = false;
                    }
                );
        }

    }
}
