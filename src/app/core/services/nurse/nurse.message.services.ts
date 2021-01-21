import { Injectable } from "@angular/core";
import { HttpService } from "../base/http.service";
import { Observable } from "rxjs";
@Injectable()
export class NurseMessageService {
    constructor(private _http: HttpService) { }

    MessageToNurse(aptID, msg) {
        const data = {
            "id": 0,
            "facilityId": 0,
            "message": msg,
            "appointmentId": aptID,
            "respondedById": 0,
            "senderId": 0,
            "specialistFirstName": " ",
            "specialistLastName": " ",
            "patientFirstName": " ",
            "patientLastName": " ",
            "roomNumber": " ",
            "isResponded": true
        }
        return this._http.post('appointment/alert/nurse', data).catch(
            (response, error) => {
                console.log(response);
                return Observable.throw(error);
            });
    }
}
