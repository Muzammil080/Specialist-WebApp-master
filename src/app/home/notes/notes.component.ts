import { Component, OnInit, Inject, OnDestroy } from '@angular/core'

import { Message } from "../../core/models/message";
import { AuthService } from '../../core/services/auth/auth.service'
import { Router, ActivatedRoute } from '@angular/router';
import { PatientInfoService, PatientInfo } from "../../core/services/specialist/patientinfo.service";
import { UIService } from "../../core/services/ui/ui.service";
import { SignalRService } from '../../core/services/signalr/signalr.service';
import { MatDialog, PageEvent } from '@angular/material'

import { ClinicalNotesService } from "../../core/services/clinical-notes/clinical.notes.service";
@Component({
    selector: 'unsigned-notes',
    // moduleId : module.id,
    templateUrl: 'notes.component.html',
    styleUrls: ['notes.component.css']
})
export class NotesComponent implements OnInit, OnDestroy {


    dynamicNotesData;
    notes;
    constructor(private _notesService: ClinicalNotesService, public dialog: MatDialog, private _signalRService: SignalRService, private _uiServices: UIService, private _authServices: AuthService, private _router: Router, private _route: ActivatedRoute, private _patientinfoservice: PatientInfoService, ) {

    }

    ngOnInit(): void {
      
        this.getNotes();
    }

    openNote(cn) {

        this._router.navigate(['/notes/' + cn.specialityId + '/' + cn.id + '/' + cn.endPointId]);
        
    }

    getNotes() {
        this._notesService.getUnsignedNotes().subscribe((res) => {
            this.notes = JSON.parse(res._body);
        }, (err) => {

        });
    }



    ngOnDestroy() {


    }

}

