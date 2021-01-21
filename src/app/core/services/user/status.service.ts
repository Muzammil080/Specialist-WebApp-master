import { Headers, Response, Http, RequestOptions } from '@angular/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Observable } from 'rxjs/Observable';
import { HttpService } from '../base/http.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import { User } from '../../../core/models/user';
import { Specialist } from '../../../core/models/specialist.model';
//import { environment } from '../../../../environments/environment';

@Injectable()
export class StatusService {
    constructor(private _http: HttpService) { }

    private UserRolespermissionCode = new BehaviorSubject<childcomponnet>(
        new childcomponnet()
    );
    private UserRolespermissionCodeMain = new BehaviorSubject<parentcomponnet>(
        new parentcomponnet()
    );

    public pagewasreloaded = true;

    //roleschild
    setpermissionCodes(acess: childcomponnet) {
        this.UserRolespermissionCode.next(acess);
    }

    getpermissionCodes(): Observable<childcomponnet> {
        return this.UserRolespermissionCode.asObservable();
    }

    //rolesparent
    setpermissionCodesParent(acess: parentcomponnet) {
        this.UserRolespermissionCodeMain.next(acess);
    }

    getpermissionCodesParent(): Observable<parentcomponnet> {
        return this.UserRolespermissionCodeMain.asObservable();
    }

    private UserInfo = new BehaviorSubject<User>(null);

    setUserInfo(acess: User) {
        if (acess.mobileNumber[0] == '+') {
            var number = acess.mobileNumber;
            acess.mobileNumber = number.slice(2);
        }

        this.UserInfo.next(acess);
    }

    getUserInfo(): Observable<User> {
        return this.UserInfo.asObservable();
    }
    private SpecilistInfo = new BehaviorSubject<Specialist>(null);

    setSpecilistInfo(acess: Specialist) {
        this.SpecilistInfo.next(acess);
    }

    getSpecilistInfo(): Observable<Specialist> {
        return this.SpecilistInfo.asObservable();
    }

    getStatus(): Observable<any> {
        return this._http.get('user/info').catch((err, caught) => {
            return Observable.throw(err);
        });
    }

    getRole(): Observable<any> {
        return this._http.get('user/roles/web').catch((err, caught) => {
            return Observable.throw(err);
        });
    }

    getSpecialistInfo(): Observable<any> {
        return this._http.get('specialist/info').catch((err, caught) => {
            return Observable.throw(err);
        });
    }

    updateUserInfo(user, specialist): Observable<any> {
        let body = {
            id: user.id,
            //remove before next build
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            mobileNumber: user.mobileNumber,
            title: user.title,
            credentials: user.credentials,
            employer: user.employer,
            address: user.address,
            address1: user.address1,
            cityName: user.cityName,
            countryId: user.countryId,
            zipCode: user.zipCode,
            stateId: user.stateId
            // secretQuestion1: user.secretQuestion1,
            // secretQuestion2: user.secretQuestion2,
            // secretAnswer1: user.secretAnswer1,
            // secretAnswer2: user.secretAnswer2
        };
        if (user.isSpecialist) {
            body['specialist'] = {
                specialityId: specialist.specialityId,
                deaNumber: specialist.deaNumber,
                npiNumber: specialist.npiNumber,
                physicianLicenseNumber: specialist.physicianLicenseNumber,
                licensedStates: specialist.licensedStates.stateName
                    ? specialist.licensedStates.stateName
                    : specialist.licensedStates,
                practiceGroup: specialist.practiceGroup
            };
        }

        return this._http.put('user/update', body).catch((err, caught) => {
            return Observable.throw(err);
        });
    }
}

export class Roles {
    role: any;
    permissions: Permissions[];
}

export class Permissions {
    accessUrl: any;
    id: any;
    permissionCode: any;
    permissionName: any;
    permissionType: any;
}

export class parentcomponnet {
    Session: boolean;
    Messages: boolean;
    Schedule: boolean;
    Endpoints: boolean;
    Specialist: boolean;
    profile: boolean;
    Radiology: boolean;
    Opd: boolean;
}

export class childcomponnet {
    // home
    CurrentVirtualSessions: boolean;
    SessionHistory: boolean;

    // scheduler
    ViewSchedule: boolean;
    MarkOffDays: boolean;
    OpdAvaialbility: boolean;
    ViewOpdSchedule: boolean;

    // OPD
    TodaysAppointment: boolean;
    SearchAppointments: boolean;
    AppointmentHistory: boolean;
    UnsignedNotesAppointments : boolean;

    // messages
    DeferredMsgs: boolean;
    Chat: boolean;
}
