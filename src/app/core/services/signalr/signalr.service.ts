import { Headers, Response, Http, RequestOptions } from '@angular/http';
import { Injectable, OnDestroy } from "@angular/core";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { HttpService } from "../base/http.service";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

import { environment } from "../../../../environments/environment";

@Injectable()
export class SignalRService
{
    constructor(private _http: HttpService) {}

    public hubConnection;
    public ishubConnection:boolean;

    // private specialistRequestId = new BehaviorSubject<number>(null);
  
    
    // //specialistRequestId
    //     setspecialistRequestId(Sid: number) {
    //         this.specialistRequestId.next(Sid);
    //     }
    
    //     getspecialistRequestId(): Observable<any> {
    //         return this.specialistRequestId.asObservable();
    //     }


}   
