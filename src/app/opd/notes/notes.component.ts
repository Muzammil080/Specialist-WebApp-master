import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ClinicalNotesService } from "../../core/services/clinical-notes/clinical.notes.service";

@Component({
    selector: "opd-notes",
    templateUrl: "./notes.component.html",
    styleUrls: ["./notes.component.css"],
})
export class NotesComponent implements OnInit {
    notes;
    pageIndex = 0;
    pageSize = 10;
    count = 0;
    pageSizeOptions = [5, 10, 25, 100];
    constructor(
        private _notesService: ClinicalNotesService,
        private _router: Router
    ) {}

    ngOnInit() {
        console.log("ngoninit notes opd")
        this.getNotes();
    }
    openNote(cn) {
        // 1 is just to distinguish it from the other route
        this._router.navigate([
            "/notes/" + 1 + '/'+ cn.specialityId+'/' + cn.id + "/" + cn.workflowInstanceId
        ]);
    }

    getNotes() {
        this._notesService.getApptUnsignedNotes(this.pageIndex,this.pageSize).subscribe(
            (res) => {
                this.notes = JSON.parse(res._body);
                console.log(this.notes,'unsigned notes appt');
            },
            (err) => {}
        );
    }

    ngOnDestroy() {}

    getNotesCount(){
        this._notesService
        .getApptUnsignedNotesCount()
        .subscribe(
            response => {
                this.count = JSON.parse(response._body);
            },
            error => { }
        );
    }
    pageChanged(event) {
        this.pageSize = event.pageSize;
        this.pageIndex = event.pageIndex;

        this.whenUserInteract();
    }
    whenUserInteract() {
        // if (this.filter !== null && this.filter !== '') {
        //     this.getEndpointFilter();
        //     this.getEndpointCountFilter();
        //     return;
        // }
        // this.getEndpointCount();
        // this.getEndpoint();

        this.getNotes();
        this.getNotesCount();

    }
}
