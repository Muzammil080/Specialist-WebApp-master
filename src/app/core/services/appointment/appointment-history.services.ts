import { HttpService } from "../base/http.service";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
@Injectable()
export class AppointmentHistoryServices {

    constructor(private http: HttpService) { }
    getApppointmentHistory(year, month, day, numberOfDays, pageIndex, pageSize) {
        return this.http.get('specialist/appointment/history/'+ year + '/' + month + '/' + day + '/' + numberOfDays + '/' + pageIndex + '/' + pageSize).catch(
            (responseData, err) => {
               return Observable.throw(err);
            });
    }
    getAppointmentFilterHistory(year, month, day, numberOfDays, filter, pageIndex, pageSize) {

        return this.http.get('specialist/appointment/history/filtered/'+ year + '/' + month + '/' + day + '/' + numberOfDays + '/' + filter + '/' + pageIndex + '/' + pageSize).catch(
            (responseData, err) => {
                return Observable.throw(err);
            });
    }
    getAppointmentCountHistory(year, month, day, numberOfDays) {
        return this.http.get('specialist/appointment/history/count/'+ year + '/' + month + '/' + day + '/' + numberOfDays).catch(
            (responseData, err) => {
                return Observable.throw(err);
            });
    }
    getAppointmentFilteredCountHistory(year, month, day, numberOfDays, filter) {
        return this.http.get('specialist/appointment/history/filtered/count/'+year + '/' + month + '/' + day + '/' + numberOfDays + '/' + filter).catch(
            (resonseData, err) => {
                return Observable.throw(err);
            });
    }
}
export class Appointment {
    partnerSiteId: any;
    facilityId: any;
    year: any;
    month: any;
    day: any;
    numberOfDays: any;
    pageIndex: any;
    pageSize: any;
    filter: any;
}