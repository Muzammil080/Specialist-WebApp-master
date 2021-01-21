import {
    Component,
    ChangeDetectionStrategy,
    ViewEncapsulation,
    OnInit,
    OnDestroy,
    AfterViewInit,
    NgZone
} from '@angular/core';
import { CalendarEvent, CalendarMonthViewDay } from 'angular-calendar';
import {
    SpecialistScheduleService,
    OffDays,
    Holidays,
    Schedule
} from '../../core/services/specialist/specialistschedule.service';
import { colors } from './calender-utils/colors';
import { Subject } from 'rxjs/Subject';
import { SpecialistService } from '../../core/services/specialist/specialist.service';

import { Message } from '../../core/models/message';
import { UIService } from '../../core/services/ui/ui.service';
import { MatDialogRef, MatDialog } from '@angular/material';
import { AuthService } from '../../core/services/auth/auth.service';
import { DayViewHour } from 'calendar-utils';
import {
    subMonths,
    addMonths,
    addDays,
    addWeeks,
    subDays,
    subWeeks,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    startOfDay,
    endOfDay
} from 'date-fns';
import { StatusService } from '../../core/services/user/status.service';
import { async } from '@angular/core/testing';

type CalendarPeriod = 'day' | 'week' | 'month';

function addPeriod(period: CalendarPeriod, date: Date, amount: number): Date {
    return {
        day: addDays,
        week: addWeeks,
        month: addMonths
    }[period](date, amount);
}

function subPeriod(period: CalendarPeriod, date: Date, amount: number): Date {
    return {
        day: subDays,
        week: subWeeks,
        month: subMonths
    }[period](date, amount);
}

function startOfPeriod(period: CalendarPeriod, date: Date): Date {
    return {
        day: startOfDay,
        week: startOfWeek,
        month: startOfMonth
    }[period](date);
}

function endOfPeriod(period: CalendarPeriod, date: Date): Date {
    return {
        day: endOfDay,
        week: endOfWeek,
        month: endOfMonth
    }[period](date);
}

@Component({
    selector: 'mySchedule',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'calender.myschedule.component.html',
    // don't do this in your app, its only so the styles get applied globally
    styleUrls: ['calender.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class CalenderMyscheduleComponent implements OnDestroy {
    view: CalendarPeriod = 'month';

    viewDate: Date = new Date();
    TimeZone;
    selectedMonthViewDay: CalendarMonthViewDay;

    selectedDatesOffDay = new Array();
    selectedDatesWorkingDay: Schedule[];
    PerDaySchedule: Schedule;

    selectedDayViewDate: Date;

    dayView: DayViewHour[];
    showtemplate = false;

    events: CalendarEvent[] = [];
    // currentyear;
    // currentmonth;
    offDays: OffDays[];
    LoadingPage = 'none';
    LoadingPageload = 'none';
    calenderView = 'block';
    holidays: Holidays[];

    minDate: Date = addMonths(new Date(), -12);

    maxDate: Date = addMonths(new Date(), 12);

    prevBtnDisabled: boolean = false;

    nextBtnDisabled: boolean = false;

    timezoneoffset: number;
    clickedBox;
    Color = false;
    specialities = [];
    constructor(
        private specialistService: SpecialistService,
        private dialog: MatDialog,
        private _statusService: StatusService,
        private _authServices: AuthService,
        private _specialistScheduleService: SpecialistScheduleService,
        private _uiService: UIService,
        private _zone: NgZone
    ) {
        this.getState();
        this._specialistScheduleService.invokeEvent.subscribe(value => {
            if (value === 'refresh') {
                this.today();
            }
        });
        this.dateOrViewChanged();
        this.getTimezone();
    }
    ngOnDestroy() {
        this.dialog.closeAll();
    }
    increment(): void {
        this.changeDate(addPeriod(this.view, this.viewDate, 1));

        this.getSchedule(
            this.viewDate.getFullYear(),
            this.viewDate.getMonth() + 1
        );
        this.getOffDays(this.viewDate.getFullYear(), this.viewDate.getMonth());
        this.getHolidays(this.viewDate.getFullYear());
    }

    decrement(): void {
        this.changeDate(subPeriod(this.view, this.viewDate, 1));

        this.getSchedule(
            this.viewDate.getFullYear(),
            this.viewDate.getMonth() + 1
        );
        this.getOffDays(this.viewDate.getFullYear(), this.viewDate.getMonth());
        this.getHolidays(this.viewDate.getFullYear());
    }

    today(): void {
        //  this.changeDate(new Date());

        this.getSchedule(
            this.viewDate.getFullYear(),
            this.viewDate.getMonth() + 1
        );
        this.getOffDays(this.viewDate.getFullYear(), this.viewDate.getMonth());
        this.getHolidays(this.viewDate.getFullYear());
    }

    dateIsValid(date: Date): boolean {
        return date >= this.minDate && date <= this.maxDate;
    }

    changeDate(date: Date): void {
        this.viewDate = date;
        this.dateOrViewChanged();
    }

    changeView(view: CalendarPeriod): void {
        this.view = view;
        this.dateOrViewChanged();
    }

    dateOrViewChanged(): void {
        this.prevBtnDisabled = !this.dateIsValid(
            endOfPeriod(this.view, subPeriod(this.view, this.viewDate, 1))
        );
        this.nextBtnDisabled = !this.dateIsValid(
            startOfPeriod(this.view, addPeriod(this.view, this.viewDate, 1))
        );
        if (this.viewDate < this.minDate) {
            this.changeDate(this.minDate);
        } else if (this.viewDate > this.maxDate) {
            this.changeDate(this.maxDate);
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
    dayClicked(day: CalendarMonthViewDay): void {
        var date = day.date.getDate().toString();
        var month = (day.date.getMonth() + 1).toString();
        var year = day.date.getFullYear();

        if (date.length < 2) {
            date = '0' + date;
        }
        if (month.length < 2) {
            month = '0' + month;
        }

        // day.cssClass  = 'css-spiner';

        this.getScheduleDay(year, month, date);
    }

    getHolidays(currentyear) {
        // this.LoadingPage='block';
        // this.calenderView='none';
        this._specialistScheduleService.getHolidays(currentyear).subscribe(
            response => {
                if (response.status == 200) {
                    this.holidays = JSON.parse(response._body);

                    this.refreshView();
                }
            },
            error => {}
        );
    }
    getSchedule(currentyear, currentmonth) {
        //  this.LoadingPageload='block';
        //  this.calenderView='none';
        this._specialistScheduleService
            .getSchedule(currentyear, currentmonth)
            .subscribe(
                response => {
                    if (response.status == 200) {
                        this.selectedDatesWorkingDay = JSON.parse(
                            response._body
                        );

                        this.refreshView();
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

    getScheduleDay(currentyear, currentmonth, currentday) {
        console.log('get schedule day');
        this.clickedBox = currentyear + '-' + currentmonth + '-' + currentday;
        for (
            var index = 0;
            index < this.selectedDatesWorkingDay.length;
            index++
        ) {
            var str = this.selectedDatesWorkingDay[index].scheduleDate;
            var res = str.split('T');
            if (this.clickedBox == res[0]) {
                let msg = new Message();
                msg.showInput = 'loader';
                msg.title = '';
                this._uiService.showMsgBox(msg);
                this._specialistScheduleService
                    .getScheduleDay(currentyear, currentmonth, currentday)
                    .subscribe(
                        response => {
                            this.specialistService.getSpeciality().subscribe(
                                resp => {
                                    let r = JSON.parse(resp._body);
                                    this.specialities = r;
                                    var radiology = this.specialities.filter(
                                        spec => spec.specialityCode == 'TS-0009'
                                    );

                                    if (response.status == 200) {
                                        this.PerDaySchedule = JSON.parse(
                                            response._body
                                        );
                                            console.log(this.PerDaySchedule,"per day schedule");
                                        msg.msg = currentday;
                                        msg.title = '';
                                        msg.okBtnTitle = null;
                                        msg.onOkBtnClick = null;
                                        msg.cancelBtnTitle = 'OK';
                                        msg.selectedDatesWorkingDay = this.PerDaySchedule[0];
                                        msg.onCancelBtnClick= () =>{
                                            const msg = new Message();
                                            msg.msg= "_cls";
                                            this._uiService.closeMsgBox(msg);
                                        };

                                        msg.showInput =
                                            this.PerDaySchedule[0]
                                                .specialityId == radiology[0].id
                                                ? 'schedueboxRadiology'
                                                : 'scheduebox';

                                        this._uiService.showMsgBox(msg);
                                        // this._uiService.closeMsgBox(msg);
                                    } else {
                                        let message = new Message();
                                        message.title = 'Error';
                                        message.msg =
                                            'No details were found this Schedule';
                                        message.iconType = 'error';
                                        message.type = 'danger';
                                        this._uiService.showToast(message);
                                        this._uiService.closeMsgBox(msg);
                                        this.dialog.closeAll();
                                    }
                                },
                                error => {}
                            );
                        },
                        error => {
                            let message = new Message();
                            message.title = 'Error';
                            message.msg = 'No details were found this Schedule';
                            message.iconType = 'error';
                            message.type = 'danger';
                            this._uiService.showToast(message);
                            this._uiService.closeMsgBox(msg);
                            this.dialog.closeAll();
                        }
                    );
            }
        }
    }
    getOffDays(currentyear, currentmonth) {
        this.LoadingPageload = 'block';
        this.calenderView = 'none';
        if (currentmonth == 0) {
            currentmonth = 12;
            currentyear = currentyear - 1;
        }
        this._specialistScheduleService
            .getOffDays(currentyear, currentmonth, 3)
            .subscribe(
                response => {
                    if (response.status == 200) {
                        this.offDays = JSON.parse(response._body);

                        this.LoadingPageload = 'none';
                        this.calenderView = 'block';
                        this.refreshView();
                    }
                    this.LoadingPageload = 'none';
                    this.calenderView = 'block';
                },
                error => {
                    this.LoadingPageload = 'none';
                    this.calenderView = 'block';
                    let msg = new Message();
                    msg.msg = 'Something went wrong, please try again.';
                    // msg.title=""
                    // msg.iconType=""
                    this._uiService.showToast(msg);
                }
            );
    }
    refresh: Subject<any> = new Subject();

    // events$: Observable<Array<CalendarEvent<{ offDays: OffDays }>>>;
    refreshView(): void {
        this.refresh.next();
    }

    beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
        if (!this.showtemplate) {
            this.getHolidays(this.viewDate.getFullYear());
            this.getSchedule(
                this.viewDate.getFullYear(),
                this.viewDate.getMonth() + 1
            );
            this.getOffDays(
                this.viewDate.getFullYear(),
                this.viewDate.getMonth()
            );
            this.showtemplate = !this.showtemplate;
        }
    }

    hourSegmentClicked(date: Date) {
        this.selectedDayViewDate = date;
        this.addSelectedDayViewClass();
    }

    beforeDayViewRender(dayView: DayViewHour[]) {
        this.dayView = dayView;
        this.addSelectedDayViewClass();
    }

    private addSelectedDayViewClass() {
        this.dayView.forEach(hourSegment => {
            hourSegment.segments.forEach(segment => {
                delete segment.cssClass;
                if (
                    this.selectedDayViewDate &&
                    segment.date.getTime() ===
                        this.selectedDayViewDate.getTime()
                ) {
                    segment.cssClass = 'cal-day-selected';
                }
            });
        });
    }
}
