import { HttpService } from "../base/http.service";
import { Injectable, OnDestroy } from "@angular/core";
import { Observable } from "rxjs";
@Injectable()
export class AppointmentService implements OnDestroy{
    constructor(private http : HttpService){}
    ngOnDestroy(){}
    getAppointmentDetails(id) {
        return this.http.get('appointment/action/history/' + id).catch(
          (response, err) => {

            return Observable.throw(err);
          });
      }

      pingEnpoint(id) {
        let body = {
            sessionId: id,
            pingType: 'Connected',
            pingClient: 'web',
            isPingBySpecialist: true
        };

        return this.http
            .post('session/ping/add', body)
            .catch((err, caught) => {
                return Observable.throw(err);
            });
    }

    saveAppointment(appointment) {
        return this.http.post('appointment/add', appointment)
            .catch((err, caught) => {
                return Observable.throwError(err);
            });
    }
}
