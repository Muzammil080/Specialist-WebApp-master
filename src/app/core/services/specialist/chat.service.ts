import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpService } from '../base/http.service';
import { Client } from 'twilio-chat';
import { TwilioChannelModel } from '../../models/twilioChannel.model';
import { BehaviorSubject } from 'rxjs';
import { MappingService } from '../mapping/mapping.service';
import { StatusService } from '../user/status.service';
import { take } from 'rxjs/operators';

declare const Twilio: any;
@Injectable()
export class ChatService {

    token;
    public twilioChannelModelList = new BehaviorSubject<TwilioChannelModel[]>(
        []
    );
    public totalMsg = new BehaviorSubject<number>(0);
    public twilioChannelList = new BehaviorSubject<any>([]);
    public userInfo: any;
    client: Client;
    constructor(
        private _http: HttpService,
        private _mappingService: MappingService,
        private _statusService: StatusService
    ) { }

    getChatChannelAccessToken(): Observable<any> {
        return this._http.get('chat/access/token').catch((err, caught) => {
            return Observable.throw(err);
        });
    }

    getChannelUsers(channelSid): Observable<any> {
        return this._http
            .get('channel/users/' + channelSid)
            .catch((err, caught) => {
                return Observable.throw(err);
            });
    }

    getUserCard(): Observable<any> {
        return this._http.get('channel/user/card').catch((err, caught) => {
            return Observable.throw(err);
        });
    }

    getChannelInfo(channelSid): Observable<any> {
        return this._http.get('channel/' + channelSid).catch((err, caught) => {
            return Observable.throw(err);
        });
    }

    createSupportChannel(GroupId): Observable<any> {
        return this._http
            .post('chat/support/channel/create/' + GroupId, null)
            .catch((err, caught) => {
                return Observable.throw(err);
            });
    }

    createChannel(body): Observable<any> {
        return this._http
            .post('chat/channel/create', body)
            .catch((err, caught) => {
                return Observable.throw(err);
            });
    }

    GetGroupUser(pageIndex, pageSize): Observable<any> {
        return this._http
            .get('accessible/users/' + pageIndex + '/' + pageSize)
            .catch((err, caught) => {
                return Observable.throw(err);
            });
    }

    GetSupportGroup(): Observable<any> {
        return this._http.get('user/support/groups').catch((err, caught) => {
            return Observable.throw(err);
        });
    }

    GetGroupUserCount(): Observable<any> {
        return this._http.get('accessible/users/count').catch((err, caught) => {
            return Observable.throw(err);
        });
    }

    public getSubscribedChannels() {
        this._statusService.getUserInfo().subscribe(res => {
            this.userInfo = res;
        });
        this.getChatChannelAccessToken().subscribe(
            res => {
                this.token = res._body;
                let channels: any;
                Twilio.Chat.Client.create(this.token).then(chatClient => {

                    this.client = chatClient;

                    this.client.getSubscribedChannels(null).then(paginator => {
                        channels = paginator.items;
                        while (paginator.hasNextPage) {
                            paginator.nextPage().then(pag => {
                                paginator = pag;
                                channels = channels.concat(paginator.items);
                            });
                        }
                        this.twilioChannelList.next(channels);
                        const twilioChannelModelList: TwilioChannelModel[] = [];
                        channels.forEach(channel => {
                            twilioChannelModelList.unshift(this._mappingService.mapTwilioChannel(channel));
                        });
                        twilioChannelModelList.sort((a: TwilioChannelModel, b: TwilioChannelModel) => {
                            return this.getTime(a.updatedOn) - this.getTime(b.updatedOn);
                        });
                        this.twilioChannelModelList.next(twilioChannelModelList);
                    });
                    this.twilioChannelModelList.pipe(take(1)).subscribe(subsChannels => {
                        this.getTotalUnreadMsgs(subsChannels);
                    });


                    this.client.on(
                        'channelJoined',
                        function (channel) {
                            channel.on(
                                'messageAdded',
                                function (message) {
                                    if (message.author === this.userInfo.userGUID) {
                                        channel.updateLastConsumedMessageIndex(
                                            message.index
                                        ).then(msgCount => {
                                            this.twilioChannelModelList.pipe(take(1)).subscribe(subsChannels => {
                                                this.getTotalUnreadMsgs(subsChannels);
                                            });
                                        });
                                    } else {
                                        this.twilioChannelModelList.pipe(take(1)).subscribe(subsChannels => {
                                            this.getTotalUnreadMsgs(subsChannels);
                                        });
                                    }
                                }.bind(this)
                            );

                        }.bind(this)
                    );
                });
            },
            err => { }
        );

    }

    public getTotalUnreadMsgs(channels: any[]) {
        let totalMsg = 0;
        if (channels) {
            channels.forEach((channel, index) => {
                channel
                    .getUnconsumedMessagesCount()
                    .then(msgCount => {
                        if (!isNaN(msgCount)) {
                            totalMsg += msgCount;
                            channels[index].unconsumedMessagesCount = msgCount;
                        } else {
                            channels[index].unconsumedMessagesCount = 0;
                        }

                        channels.sort((a: any, b: any) => {
                            return this.getTime(a.state.dateUpdated) - this.getTime(b.state.dateUpdated);
                        });
                        channels = channels.reverse();

                        // if (channels.length - 1 === index) {
                        this.twilioChannelModelList.next(channels);
                        this.twilioChannelList.next(channels);
                        this.totalMsg.next(totalMsg);
                        // }
                    })
                    .catch(e => console.error(e));
            });
        }
    }

    stopService() {
        this.token = null;
        this.twilioChannelModelList.next([]);
        this.twilioChannelList.next([]);
        this.totalMsg.next(0);
        this.userInfo = null;
        if (this.client) {
            this.client.shutdown();
        }

    }
    // getAllMessage(id): Observable<any> {
    //     return this._http.get("requests/" + id + "/messages/0/0/false").catch((err, caught) => {
    //         return Observable.throw(err);
    //     });
    // }
    // sendMessage(requestMsgSessionId, message): Observable<any> {
    //     let body = {
    //         RequestMsgSessionId: requestMsgSessionId,
    //         Message: message,
    //     }
    //     return this._http.post("requests/message/send", body).catch((err, caught) => {
    //         return Observable.throw(err);
    //     });
    // }

    private getTime(date?: Date) {
        return date != null ? date.getTime() : 0;
    }


    public sortByDueDate(): void {

    }
}
