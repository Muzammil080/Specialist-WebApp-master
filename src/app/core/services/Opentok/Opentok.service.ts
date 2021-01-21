import { Injectable } from '@angular/core';

import * as OT from '@opentok/client';
import { Accepted } from '../specialist/specialistrequests.service';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class OpentokService {
    session: OT.Session;
    token: string;
    PublisherCommands = new Subject();
    SubscriberCommands = new Subject();
    MuteCommands = new Subject();
    StrokeCommands = new Subject();
    constructor() {}

    getOT() {
        return OT;
    }
    initSession(EndpointSessionInfo: Accepted) {
        console.log('initSession');
        if (
            EndpointSessionInfo.token &&
            EndpointSessionInfo.resourceId &&
            EndpointSessionInfo.host
        ) {
            this.session = this.getOT().initSession(
                EndpointSessionInfo.host,
                EndpointSessionInfo.resourceId
            );
            this.token = EndpointSessionInfo.token;
            return Promise.resolve(this.session);
        } else {
            return;
        }
    }

    connect() {
        console.log('connect called');
        return new Promise((resolve, reject) => {
            this.session.connect(this.token, err => {
                console.log('session.connect Called');
                if (err) {
                    console.log('error:', err);
                    reject(err);
                } else {
                    console.log('session: ', this.session);
                    resolve(this.session);
                }
            });
        });
    }

}
export class StreamStatus{
    isPrimarySpecialist:boolean;
    isKart:boolean;
    streamStatus:string;
}
