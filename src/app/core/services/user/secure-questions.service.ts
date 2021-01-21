import { Headers, Response, Http, RequestOptions } from '@angular/http';
import { Injectable, OnDestroy } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";
import { HttpService } from "../base/http.service";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

import { environment } from "../../../../environments/environment";

@Injectable()
export class SecureQuestionsService
{
    constructor(private _http: HttpService) {}

    getSecretQuestions(): Observable<any>
    {
        return this._http.get('user/questions/all').catch(error => Observable.throw(error));
    }
}