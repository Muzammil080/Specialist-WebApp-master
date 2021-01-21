import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'mwl-demo-utils-calendar-header',
  template: `
    <div class="row text-center">
      <div class="col-md-4 text-left">
        <div class="btn-group">
          <div
            class="btn mat-raised-button mat-primary"
            mwlCalendarPreviousView
            [view]="view"
            [(viewDate)]="viewDate"
            (viewDateChange)="viewDateChange.next(viewDate)">
            Previous
          </div>
          <div
            class="btn mat-raised-button gry-btn"
            mwlCalendarToday
            [(viewDate)]="viewDate"
            (viewDateChange)="viewDateChange.next(viewDate)">
            Today
          </div>
          <div
            class="btn mat-raised-button mat-primary"
            mwlCalendarNextView
            [view]="view"
            [(viewDate)]="viewDate"
            (viewDateChange)="viewDateChange.next(viewDate)">
            Next
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <h3 class="pri-txt">{{ viewDate | calendarDate:(view + 'ViewTitle'):locale }}</h3>
      </div>
      
    </div>
    <br>
  `
})

// <div class="col-md-4 text-right">
// <div class="btn-group">
//   <div
//     class="btn mat-raised-button mat-primary"
//     (click)="viewChange.emit('month')"
//     [class.active]="view === 'month'">
//     Month
//   </div>
//   <div
//     class="btn mat-raised-button mat-primary"
//     (click)="viewChange.emit('week')"
//     [class.active]="view === 'week'">
//     Week
//   </div>
  
// </div>
// </div>
export class CalendarHeaderComponent {
  @Input() view: string;

  @Input() viewDate: Date;

  @Input() locale: string = 'en';

  @Output() viewChange: EventEmitter<string> = new EventEmitter();

  @Output() viewDateChange: EventEmitter<Date> = new EventEmitter();
}
