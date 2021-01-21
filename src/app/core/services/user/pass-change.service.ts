import { Headers, Response, Http, RequestOptions } from '@angular/http';
import { Injectable, OnDestroy } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { HttpService } from "../base/http.service";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import { User } from '../../../core/models/user'
import { environment } from "../../../../environments/environment";

@Injectable()
export class PassChangeService {
    constructor(private _http: HttpService) { }

    setNewPass(Cpass, Npass): Observable<any> {
        let body = {
            currentPassword: Cpass,
            newPassword: Npass,
        }
        return this._http.put("user/password/change", body).catch((err, caught) => {
            return Observable.throw(err);
        });
    }

    getUserQuestions(email): Observable<any> {
        return this._http.get("user/questions/" + email).catch((err, caught) => {
            return Observable.throw(err);
        });
    }

    checkanswers(email, ans1, ans2): Observable<any> {
        let body = {
            EmailAddress: email,
            Answer1: ans1,
            Answer2: ans2
        }
        return this._http.put("user/questions/verify", body).catch((err, caught) => {
            return Observable.throw(err);
        });
    }

    verifyandchange(key, pass): Observable<any> {
        let body = {
            verificationKey: key,
            newPassword: pass,

        }
        return this._http.put("user/password/verifyandchange", body).catch((err, caught) => {
            return Observable.throw(err);
        });
    }

    verifyandchangequestion(key, pass, Question1, Question2, Answer1, Answer2): Observable<any> {
        let body = {
            verificationKey: key,
            newPassword: pass,
            secretQuestion1: Question1,
            secretAnswer1: Answer1,
            secretQuestion2: Question2,
            secretAnswer2: Answer2,
        }
        return this._http.put("user/password/question/verifyandchange", body).catch((err, caught) => {
            return Observable.throw(err);
        });
    }

}

export class Roles {
    role: any
    permissions: Permissions[];
}

export class Permissions {
    accessUrl: any;
    id: any;
    permissionCode: any;
    permissionName: any;
    permissionType: any;
}
