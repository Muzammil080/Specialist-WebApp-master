import { Component, OnInit, OnDestroy } from '@angular/core';
import { StatusService } from '../core/services/user/status.service';
import { MatDialog } from '@angular/material';

@Component({
    selector: 'schedule',
    moduleId: module.id,
    templateUrl: 'schedule.component.html',
    styleUrls: ['schedule.component.css']
})
export class ScheduleComponent implements OnInit, OnDestroy {
    viewSchedule = false;
    markOffDays = false;
    opdAvailability = false;
    opdSchedule = false;

    constructor(
        private dialog: MatDialog,
        private _statusService: StatusService
    ) {}

    ngOnInit() {
        this._statusService.getpermissionCodes().subscribe(res => {
            if (res) {
                this.viewSchedule = res.ViewSchedule;
                this.markOffDays = res.MarkOffDays;
                this.opdAvailability = res.OpdAvaialbility;
                this.opdSchedule = res.ViewOpdSchedule;
            }
        });
    }

    ngOnDestroy() {
        this.dialog.closeAll();
    }
}
