import { Component, OnInit, OnDestroy, Inject } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {
    FormGroup,
    FormControl,
    Validators,
    FormBuilder
} from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import {
    SpecialistScheduleService,
    OffDays,
    Holidays,
    Schedule
} from '../../core/services/specialist/specialistschedule.service';
import { Sort } from '@angular/material';
import { MatOptionSelectionChange } from '@angular/material';
import { StatusService } from '../../core/services/user/status.service';
// addSpec
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { SpecialistService } from '../../core/services/specialist/specialist.service';
export class State {
    constructor(public id: string, public name: string) {}
}

@Component({
    moduleId: module.id,
    templateUrl: 'msgdialog.component.html'
})
export class MsgDialog implements OnInit, OnDestroy {
    title = '';
    msg = 'Test Message';
    okBtnTitle = 'Ok';
    cancelBtnTitle = 'Cancel';
    inputMessage = '';
    selectedDatesWorkingDay: Schedule;
    showInput;
    public scrollbarOptions = { axis: 'y', theme: 'minimal-dark' };
    btn: boolean = true;
    timezoneoffset: number;
    TimeZone;
    Color = false;
    imageUrl: any;
    sortedData;
    Defaultsort: Sort;

    constructor(
        private _statusService: StatusService,
        private _specialist: SpecialistService,
        private _authServices: AuthService,
        public dialogRef: MatDialogRef<MsgDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    stateCtrl: FormControl;
    filteredStates: Observable<any[]>;

    states: State[] = [];

    filterStates(name: string) {
        return this.states.filter(
            state => state.name.toLowerCase().indexOf(name.toLowerCase()) === 0
        );
    }
    getSpecilistlist(event: MatOptionSelectionChange, id) {
        if (event.source.selected) {
        }
    }

    sortData(sort: Sort) {
        const data = this.selectedDatesWorkingDay.details.slice();
        if (!sort.active || sort.direction == '') {
            this.sortedData = data;
            return;
        }

        if (this.Color) {
            this.sortedData = data.sort((a, b) => {
                let isAsc = sort.direction == 'asc';
                switch (sort.active) {
                    case 'PARTNERSITE':
                        return compare(
                            a.partnerSiteName,
                            b.partnerSiteName,
                            isAsc
                        );
                    case 'FACILITY':
                        return compare(a.facilityName, b.facilityName, isAsc);

                    case 'DOCTOR':
                        return compare(
                            +a.specialistName,
                            +b.specialistName,
                            isAsc
                        );
                    case 'CONTACT':
                        return compare(
                            +a.spcialistContactNumber,
                            +b.spcialistContactNumber,
                            isAsc
                        );
                    case 'PRIORITY':
                        return compare(+a.priority, +b.priority, isAsc);

                    case 'START':
                        return compare(
                            +a.shiftStartTimeInUTC,
                            +b.shiftStartTimeInUTC,
                            isAsc
                        );
                    case 'END':
                        return compare(
                            +a.shiftEndTimeInUTC,
                            +b.shiftEndTimeInUTC,
                            isAsc
                        );
                    default:
                        return 0;
                }
            });
        } else {
            this.sortedData = data.sort((a, b) => {
                let isAsc = sort.direction == 'asc';
                switch (sort.active) {
                    case 'PARTNERSITE':
                        return compare(
                            a.partnerSiteName,
                            b.partnerSiteName,
                            isAsc
                        );
                    case 'FACILITY':
                        return compare(a.facilityName, b.facilityName, isAsc);
                    case 'DOCTOR':
                        return compare(
                            +a.specialistName,
                            +b.specialistName,
                            isAsc
                        );
                    case 'CONTACT':
                        return compare(
                            +a.spcialistContactNumber,
                            +b.spcialistContactNumber,
                            isAsc
                        );
                    case 'PRIORITY':
                        return compare(+a.priority, +b.priority, isAsc);
                    case 'START':
                        return compare(
                            +a.shiftStartTime,
                            +b.shiftStartTime,
                            isAsc
                        );
                    case 'END':
                        return compare(+a.shiftEndTime, +b.shiftEndTime, isAsc);
                    default:
                        return 0;
                }
            });
        }
    }

    getTimezone() {
        var d = new Date();
        var offset = d.getTimezoneOffset();

        this._statusService.getUserInfo().subscribe(
            response => {
                let getUser = response;
                if (getUser != null) {
                    offset = offset + getUser.utcDSTOffset / 60;
                    this.timezoneoffset = offset;
                }
            },
            error => {}
        );
    }
    getState() {
        this._statusService.getUserInfo().subscribe(
            response => {
                let getUser = response;
                if (getUser != null) {
                    this.TimeZone = getUser.stateName;
                }
            },
            error => {}
        );
    }

    ngOnDestroy() {
        //  document.body.style.overflow = "auto";
    }
    ngOnInit() {
        // document.body.style.overflow = "hidden";
        // document.body.style.overflow = "auto";

        if (this.showInput == 'loader') {
            document
                .getElementsByClassName('mat-dialog-container')[0]
                .classList.add('loading-blur-background');
        }

        if (this.showInput == 'addSpec') {
            this._specialist.getSpeciality().subscribe(
                response => {
                    this.states = JSON.parse(response._body);
                    this.filteredStates = this.stateCtrl.valueChanges.pipe(
                        startWith(''),
                        map(state =>
                            state
                                ? this.filterStates(state)
                                : this.states.slice()
                        )
                    );
                },
                error => {}
            );

            this.stateCtrl = new FormControl();
        }

        if (this.showInput == 'scheduebox') {
            this.getTimezone();
            this.getState();
            this.sortedData = this.selectedDatesWorkingDay.details.slice();
            for (
                var index = 0;
                index < this.selectedDatesWorkingDay.details.length;
                index++
            ) {
                if (this.selectedDatesWorkingDay.details[index].priority == 1) {
                    this.selectedDatesWorkingDay.details[index].priority =
                        'First';
                } else if (
                    this.selectedDatesWorkingDay.details[index].priority == '2'
                ) {
                    this.selectedDatesWorkingDay.details[index].priority =
                        'Second';
                } else if (
                    this.selectedDatesWorkingDay.details[index].priority == '3'
                ) {
                    this.selectedDatesWorkingDay.details[index].priority =
                        'Third';
                } else if (
                    this.selectedDatesWorkingDay.details[index].priority == '4'
                ) {
                    this.selectedDatesWorkingDay.details[index].priority =
                        'Fourth';
                } else if (
                    this.selectedDatesWorkingDay.details[index].priority == '5'
                ) {
                    this.selectedDatesWorkingDay.details[index].priority =
                        'Fifth';
                } else if (
                    this.selectedDatesWorkingDay.details[index].priority == '6'
                ) {
                    this.selectedDatesWorkingDay.details[index].priority =
                        'Sixth';
                } else if (
                    this.selectedDatesWorkingDay.details[index].priority == '7'
                ) {
                    this.selectedDatesWorkingDay.details[index].priority =
                        'Seveth';
                } else if (
                    this.selectedDatesWorkingDay.details[index].priority == '8'
                ) {
                    this.selectedDatesWorkingDay.details[index].priority =
                        'Eight';
                } else if (
                    this.selectedDatesWorkingDay.details[index].priority == '9'
                ) {
                    this.selectedDatesWorkingDay.details[index].priority =
                        'Ninth';
                } else if (
                    this.selectedDatesWorkingDay.details[index].priority == '10'
                ) {
                    this.selectedDatesWorkingDay.details[index].priority =
                        'Tenth';
                }
            }
        }
        if (this.showInput == 'schedueboxRadiology') {
            this.getTimezone();
            this.getState();
            this.sortedData = this.selectedDatesWorkingDay.details.slice();
            for (
                var index = 0;
                index < this.selectedDatesWorkingDay.details.length;
                index++
            ) {
                if (this.selectedDatesWorkingDay.details[index].priority == 1) {
                    this.selectedDatesWorkingDay.details[index].priority =
                        'First';
                } else if (
                    this.selectedDatesWorkingDay.details[index].priority == '2'
                ) {
                    this.selectedDatesWorkingDay.details[index].priority =
                        'Second';
                } else if (
                    this.selectedDatesWorkingDay.details[index].priority == '3'
                ) {
                    this.selectedDatesWorkingDay.details[index].priority =
                        'Third';
                } else if (
                    this.selectedDatesWorkingDay.details[index].priority == '4'
                ) {
                    this.selectedDatesWorkingDay.details[index].priority =
                        'Fourth';
                } else if (
                    this.selectedDatesWorkingDay.details[index].priority == '5'
                ) {
                    this.selectedDatesWorkingDay.details[index].priority =
                        'Fifth';
                } else if (
                    this.selectedDatesWorkingDay.details[index].priority == '6'
                ) {
                    this.selectedDatesWorkingDay.details[index].priority =
                        'Sixth';
                } else if (
                    this.selectedDatesWorkingDay.details[index].priority == '7'
                ) {
                    this.selectedDatesWorkingDay.details[index].priority =
                        'Seveth';
                } else if (
                    this.selectedDatesWorkingDay.details[index].priority == '8'
                ) {
                    this.selectedDatesWorkingDay.details[index].priority =
                        'Eight';
                } else if (
                    this.selectedDatesWorkingDay.details[index].priority == '9'
                ) {
                    this.selectedDatesWorkingDay.details[index].priority =
                        'Ninth';
                } else if (
                    this.selectedDatesWorkingDay.details[index].priority == '10'
                ) {
                    this.selectedDatesWorkingDay.details[index].priority =
                        'Tenth';
                }
            }
        }
    }
}

function compare(a, b, isAsc) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
