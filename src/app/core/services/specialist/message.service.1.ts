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
export class MessageService
{
    constructor(private _http: HttpService) {}

    private specialistRequestId = new BehaviorSubject<number>(null);
  
    
    //specialistRequestId
        setspecialistRequestId(Sid: number) {
            this.specialistRequestId.next(Sid);
        }
    
        getspecialistRequestId(): Observable<any> {
            return this.specialistRequestId.asObservable();
        }


    getMessage(id): Observable<any> {
        return this._http.get("requests/"+id+"/messages/unread") .catch((err, caught) => {
            return Observable.throw(err);
        });
    }
    getDeferredLastMsg(): Observable<any> {
        return this._http.get("requests/deferred/last/message") .catch((err, caught) => {
            return Observable.throw(err);
        });
    }
    getAllMessage(id): Observable<any> {
        return this._http.get("requests/"+id+"/messages/0/0/false") .catch((err, caught) => {
            return Observable.throw(err);
        });
    }
    sendMessage(requestMsgSessionId,message): Observable<any> {
        let body = {
            RequestMsgSessionId:requestMsgSessionId,
            Message:message,  
        }
        return this._http.post("requests/message/send",body) .catch((err, caught) => {
            return Observable.throw(err);
        });
    }

    setMarkRead(messageid): Observable<any> {
      
        let body = {
            msgids:[messageid],
        }
        return this._http.put("requests/message/mark/read",body) .catch((err, caught) => {
            return Observable.throw(err);
        });
    }
    getMsgCount(): Observable<any> {
        return this._http.get("requests/messages/unread/count") .catch((err, caught) => {
            return Observable.throw(err);
        });
    }
}   
export class DeferredRequests
{
    id: any;
    requestMsgSessionId: any;
    fromUserId: any;
    isUnRead: any;
    receivedOn: any;
    message: any;
    partnerSiteName: any;
    isOpen:any;
    specialistRequestId:any;
    
}

export class ChatMessages
{
    
     id: any;
    requestMsgSessionId: any;
     fromUserId: any;
     isUnRead: any;
     receivedOn: any;
    message: any;
    receivedOnInUtc:any;
    // partnerSiteName: any;
    // isOpen: any;
}