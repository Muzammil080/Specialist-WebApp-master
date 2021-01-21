import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,OnInit
} from '@angular/core';
import { CalendarEvent, CalendarMonthViewDay } from 'angular-calendar';
import { SpecialistScheduleService,OffDays,Holidays } from "../../core/services/specialist/specialistschedule.service";
import { Router }  from '@angular/router';  
import { Message } from "../../core/models/message";
import { UIService } from "../../core/services/ui/ui.service";
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
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
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
  selector: 'markOffDays',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'calender.component.html',
  // don't do this in your app, its only so the styles get applied globally
  styleUrls : ['calender.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CalenderComponent  implements OnInit  {
  view: CalendarPeriod = 'month';

  viewDate: Date = new Date();

  selectedMonthViewDay: CalendarMonthViewDay;

  selectedDates = new Array;
  // selectedDatesOffDay = new Array;

  selectedDayViewDate: Date;

  dayView: DayViewHour[];

  events: CalendarEvent[] = [];

  minDate: Date = subDays(new Date(), 1);
  
    maxDate: Date = addMonths(new Date(), 12);
  
    prevBtnDisabled: boolean = false;
  
    nextBtnDisabled: boolean = false;

    offDays:OffDays[];
    holidays:Holidays[];
   
     offDaysremove:OffDays[] = [];
    
    showtemplate=false;
    clickedBox;
    //  currentyear;

    //  currentmonth;
     calenderView='block';
     LoadingPage='none';
     LoadingPageload='none';
     doneButton;

    constructor( private _specialistScheduleService:SpecialistScheduleService ,private _router: Router ,private _uiService: UIService,) {
      this.dateOrViewChanged();
    }
    increment(): void {
      this.changeDate(addPeriod(this.view, this.viewDate, 1));
     
      this.getOffDays(this.viewDate.getFullYear(),this.viewDate.getMonth());
      this.getHolidays(this.viewDate.getFullYear());
     
    }
  
    decrement(): void {
      this.changeDate(subPeriod(this.view, this.viewDate, 1));
     
      this.getOffDays(this.viewDate.getFullYear(),this.viewDate.getMonth());
      this.getHolidays(this.viewDate.getFullYear());
    }
  
    today(): void {
      this.changeDate(new Date());
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
  
  dayClicked(day: CalendarMonthViewDay): void {

    // if (this.selectedMonthViewDay) {
    //   delete this.selectedMonthViewDay.cssClass;
    // }
    
   
    var offdayarrayexists=false;
    var toggle=false
var date = day.date.getDate().toString();
var month = (day.date.getMonth() +  1).toString();

if(date.length < 2)
{
  date ='0'+ date
}
if(month.length < 2)
{
  month ='0'+ month
}
   
     this.clickedBox =day.date.getFullYear()+'-'+ month +'-'+ date +'T00:00:00';
   
    for (var index = 0; index < this.offDays.length; index++) {
        
      if (this.clickedBox == this.offDays[index].offDay) {
        offdayarrayexists=true;
        toggle=true;
  
      this.offDaysremove[this.offDaysremove.length]=this.offDays[index];
       this.offDays.splice(index, 1);
     

      }

    }

    if(!toggle)
    {
      for (var index = 0; index < this.offDaysremove.length; index++) {
        
        if (this.clickedBox == this.offDaysremove[index].offDay) {
          offdayarrayexists=true;
          this.offDays[this.offDays.length]=this.offDaysremove[index];
          this.offDaysremove.splice(index , 1);
        
   
          
        }
    
      }
    }

   if (!offdayarrayexists) {
    var del = false;
    for (var index = 0; index < this.selectedDates.length; index++) {
       
      if( this.selectedDates[index] == this.clickedBox)
        {

          del=true
          var index = this.selectedDates.indexOf(this.clickedBox, 0);
          if (index > -1) {
            this.selectedDates.splice(index, 1);
         
          }
        }else
        {
          del=false;
        }
     
   }
  //  else{
    // day.cssClass = 'cal-day-selected';
    if (del == false) {
      this.selectedDates.push(this.clickedBox);
    }
   }
    // }
   // this.refreshView();
   

  //  this.selectedMonthViewDay = day;

  }

  ngOnInit()
  {
    // if (this.offDaysremove.length <= 0 || this.selectedDates.length <= 0) {
    //   this.doneButton=true;
    // }
  }
  done()
  {
        this.calenderView='none'
        this.LoadingPage='block'
        for (var index = 0; index < this.offDaysremove.length; index++) {

        this._specialistScheduleService.setOffDays(this.offDaysremove[index].id,this.offDaysremove[index].offDay,false).subscribe(
          
            (response) => {
      
                if(response.status == 200 )
                {     
                  // this.offDays = JSON.parse(response._body);

                  this.getOffDays(this.viewDate.getFullYear(),this.viewDate.getMonth());
                  this.offDaysremove=[];
                  this.calenderView='block';
                  this.LoadingPage='none'
                  this._specialistScheduleService.callMethodOfSecondComponent(); 
                 
                }   
            },
            (error) =>{

              this.calenderView='block';
              this.LoadingPage='none'
              let msg = new Message();
              msg.msg = "Something went wrong, please try again."
              // msg.title=""
              // msg.iconType=""
              this._uiService.showToast(msg);

            } 
        );

      }

      for (var index = 0; index < this.selectedDates.length; index++) {
        
          this._specialistScheduleService.setOffDays(0,this.selectedDates[index],true).subscribe(
            
              (response) => {
        
                  if(response.status == 200 )
                  {     
                    // this.offDays = JSON.parse(response._body);
                   
                    this.getOffDays(this.viewDate.getFullYear(),this.viewDate.getMonth());
                    this.selectedDates=[];
                    this.calenderView='block';
                    this.LoadingPage='none';
                    this._specialistScheduleService.callMethodOfSecondComponent(); 
                   
                  }   
              },
              (error) =>{
                
                this.calenderView='block';
                this.LoadingPage='none'
                let msg = new Message();
                msg.msg = "Something went wrong, please try again."
                // msg.title=""
                // msg.iconType=""
                this._uiService.showToast(msg);
                
              } 
          );
  
        }
      
        // this._router.navigate(['/schedule']); 
       // this.getOffDays(this.currentyear,this.currentmonth);
  }
  refresh: Subject<any> = new Subject();
  
  // events$: Observable<Array<CalendarEvent<{ offDays: OffDays }>>>;
  refreshView(): void {
    this.refresh.next();
  }
  getHolidays(currentyear)
  {
    // this.LoadingPageload='block';
    // this.calenderView='none';
    this._specialistScheduleService.getHolidays(currentyear).subscribe(
      
            (response) => {
      
                if(response.status == 200 )
                {     
                  this.holidays = JSON.parse(response._body);
                  this.refreshView();
                  // this.LoadingPageload='none';
                  // this.calenderView='block';
           
                 

                }   
            },
            (error) =>{
               
               
            } 
        );
  }

  getOffDays(currentyear,currentmonth)
  {
    this.LoadingPageload='block';
    this.calenderView='none';
    if (currentmonth == 0) {
      currentmonth =12
      currentyear =currentyear-1;
    }
    this._specialistScheduleService.getOffDays(currentyear,currentmonth,3).subscribe(
      
            (response) => {
      
                if(response.status == 200 )
                {     
                  this.offDays = JSON.parse(response._body);
                  this.refreshView();
                  this.LoadingPageload='none';
                  this.calenderView='block';
                }   

                this.calenderView='block';
                this.LoadingPageload='none';
            },
            (error) =>{
              this.calenderView='block';
              this.LoadingPageload='none';
              
              let msg = new Message();
              msg.msg = "Something went wrong, please try again."
              // msg.title=""
              // msg.iconType=""
              this._uiService.showToast(msg);
            
            
            } 
        );
  }
  
  beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
   


if(!this.showtemplate)
{
  this.getHolidays(this.viewDate.getFullYear());
  this.getOffDays(this.viewDate.getFullYear(),this.viewDate.getMonth());
  this.showtemplate=!this.showtemplate;
}

       
              
    body.forEach(day => {
      
      if (!this.dateIsValid(day.date)) {
        day.cssClass = 'cal-disabled';
      }
    });

  //   for (var index = 0; index < this.selectedDates.length; index++) {
      
  //   body.forEach(day => {
    
  //     var date = day.date.getDate().toString();
  //     var month = (day.date.getMonth() +  1).toString();
      
  //     if(date.length < 2)
  //     {
  //       date ='0'+ date
  //     }
  //     if(month.length < 2)
  //     {
  //       month ='0'+ month
  //     }
         
  //          this.clickedBox =day.date.getFullYear()+'-'+ month +'-'+ date +'T00:00:00';

  //     if (
  //       this.clickedBox === this.selectedDates[index]
  //     ) {
  //       day.cssClass = 'cal-day-selected';
  //       // this.selectedMonthViewDay = day;
  //     }
  //   });
  // }

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
    // this.dayView.forEach(hourSegment => {
    //   hourSegment.segments.forEach(segment => {
    //     delete segment.cssClass;
    //     if (
    //       this.selectedDayViewDate &&
    //       segment.date.getTime() === this.selectedDayViewDate.getTime()
    //     ) {
    //       segment.cssClass = 'cal-day-selected';
          
    //     }
    //   });
    // });
  }
}

