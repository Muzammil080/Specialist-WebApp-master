import {
    Component,
    OnInit,
    OnDestroy,
    AfterViewInit
} from '@angular/core';

import { Message } from '../core/models/message';
import {
    MessageService,
    DeferredRequests,
    ChatMessages
} from '../core/services/specialist/message.service';
import { MalihuScrollbarService } from 'ngx-malihu-scrollbar';
import { ISubscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Rx';
import { StatusService } from '../core/services/user/status.service';
import { MatDialog } from '@angular/material';
import { UIService } from '../core/services/ui/ui.service';
@Component({
    selector: "defer-chat",
    moduleId: module.id,
    templateUrl: 'deferChat.component.html',
    styleUrls: ['deferChat.component.css']
})
export class DeferChatComponent implements OnInit, OnDestroy, AfterViewInit {
    pageTitle;
    UserId;
    chatmessages: ChatMessages[] = [];
    message: ChatMessages[] = [];
    chatbox: string;
    public scrollbarOptions = { axis: 'y', theme: 'minimal-dark' };
    firsttime;
    firstscroll;
    deferredRequest: DeferredRequests[] = [];
    requestgetAllMessage: ISubscription;
    requestrefreshmsg;
    requestrefreshsubscribemsg: ISubscription;
    LoadingPage;
    LoadingPagechatbox = 'none';
    Msgpage;
    requestMsgSessionId;
    rowIndx;
    visibilitysessionmessage = 'none';
    sendBtn = true;

    constructor(
        private dialog: MatDialog,
        private _statusService: StatusService,
        private _messageService: MessageService,
        private mScrollbarService: MalihuScrollbarService,
        private _uiService: UIService) { }

    ngAfterViewInit() {
        this.mScrollbarService.initScrollbar('#deferMsgContainer', {
            axis: 'y',
            theme: 'minimal-dark'
        });
    }

    scrollast() {
        this.mScrollbarService.initScrollbar('#deferMsgContainer', {
            axis: 'y',
            theme: 'minimal-dark'
        });

        this.mScrollbarService.scrollTo('#deferMsgContainer', 'last', {
            scrollInertia: 1
        });
    }

    getAllMsg(id) {
        this.LoadingPagechatbox = 'block';
        this.chatmessages = null;

        this.requestMsgSessionId = id;
        this._messageService.getAllMessage(id).subscribe(
            response => {
                if (response.status === 200) {
                    this.chatmessages = JSON.parse(response._body);

                    this.LoadingPage = 'none';

                    setTimeout(() => {
                        this.LoadingPagechatbox = 'none';

                        this.scrollast();
                    }, 100);

                    this.firstscroll = true;
                }
            },
            error => {
                this.LoadingPagechatbox = 'none';
                this.LoadingPage = 'none';

                const msg = new Message();
                msg.msg = 'Something went wrong, please try again.';
                this._uiService.showToast(msg);
            }
        );
    }

    getUnreadMsg() {
        this._messageService.getMessage(this.requestMsgSessionId).subscribe(
            response => {
                if (response.status === 200) {
                    if (JSON.parse(response._body).length !== 0) {
                        this.message = JSON.parse(response._body);

                        for (
                            let index = 0;
                            index < this.message.length;
                            index++
                        ) {
                            this.chatmessages.push(this.message[index]);
                            this._messageService
                                .setMarkRead(this.message[index].id)
                                .subscribe(
                                    res => {
                                        if (res.status === 200) {
                                        }
                                    },
                                    error => { }
                                );
                        }

                        this.getDeferredLastMsgs();
                        this.scrollast();
                    }
                }
            },
            error => { }
        );
    }

    getDeferredLastMsgs() {
        this._messageService.getDeferredLastMsg().subscribe(
            response => {
                if (response.status === 200) {
                    if (JSON.parse(response._body) !== '') {
                        this.Msgpage = true;
                        this.deferredRequest = JSON.parse(response._body);
                        this.deferredRequest.reverse();

                        if (!this.firsttime) {
                            this._messageService
                                .getspecialistRequestId()
                                .subscribe(Sid => {
                                    this.rowIndx = Sid;
                                });
                            if (this.rowIndx == null) {
                                this.rowIndx = this.deferredRequest[0].specialistRequestId;
                                this.getAllMsg(
                                    this.deferredRequest[0].requestMsgSessionId
                                );
                            } else {
                                for (
                                    let index = 0;
                                    index < this.deferredRequest.length;
                                    index++
                                ) {
                                    if (
                                        this.deferredRequest[index]
                                            .specialistRequestId === this.rowIndx
                                    ) {
                                        this.getAllMsg(
                                            this.deferredRequest[index]
                                                .requestMsgSessionId
                                        );
                                    }
                                }
                            }

                            this.firsttime = true;
                        }
                    } else {
                        this.LoadingPage = 'none';
                        this.Msgpage = false;
                        this.visibilitysessionmessage = 'block';
                    }
                } else if (response.status === 204) {
                    this.LoadingPage = 'none';
                    this.Msgpage = false;
                    this.visibilitysessionmessage = 'block';
                }
            },
            error => {
                this.LoadingPage = 'none';
            }
        );
    }

    ngOnInit(): void {
        this.LoadingPage = 'block';
        this.Msgpage = false;

        this._statusService.getUserInfo().subscribe(
            response => {
                if (response) {
                    this.UserId = response.id;
                }
            },
            error => { }
        );

        this.getDeferredLastMsgs();
        this.requestrefreshmsg = Observable.interval(3000);
        this.requestrefreshsubscribemsg = this.requestrefreshmsg.subscribe(
            ex => {
                this.getUnreadMsg();
                this.getDeferredLastMsgs();
            }
        );
    }

    ngOnDestroy() {
        this.dialog.closeAll();
        this.requestrefreshsubscribemsg.unsubscribe();
    }

    messagebreak() { }

    deferlist() { }

    msgretry(index, msg) {
        if (this.sendBtn) {
            this.chatmessages[index].id = 'waiting';
            if (msg !== '') {
                const d = new Date();
                this.message[0] = {
                    id: 'waiting',
                    requestMsgSessionId: this.requestMsgSessionId,
                    message: msg,
                    fromUserId: this.UserId,
                    isUnRead: '',
                    receivedOn: '',
                    receivedOnInUtc:
                        d.getUTCFullYear() +
                        '-' +
                        ((d.getUTCMonth() + 1 < 10 ? '0' : '') +
                            (d.getUTCMonth() + 1)) +
                        '-' +
                        ((d.getUTCDate() < 10 ? '0' : '') + d.getUTCDate()) +
                        'T' +
                        ((d.getUTCHours() < 10 ? '0' : '') + d.getUTCHours()) +
                        ':' +
                        ((d.getUTCMinutes() < 10 ? '0' : '') +
                            d.getUTCMinutes()) +
                        ':' +
                        ((d.getUTCSeconds() < 10 ? '0' : '') +
                            d.getUTCSeconds()) +
                        '.000'
                };
                this.chatbox = '';
                this.scrollast();
                this._messageService
                    .sendMessage(
                        this.message[0].requestMsgSessionId,
                        this.message[0].message
                    )
                    .subscribe(
                        response => {
                            if (response.status === 200) {
                                this.chatmessages[
                                    this.chatmessages.length
                                ] = this.message[0];
                                this.chatmessages.splice(index, 1);
                                this.chatmessages[
                                    this.chatmessages.length - 1
                                ].id = 'ok';
                                this.getDeferredLastMsgs();
                                this.message = [];
                                this.sendBtn = true;
                            }
                            this.sendBtn = true;
                        },
                        error => {
                            this.chatmessages[index].id = 'notok';
                            this.sendBtn = true;
                        }
                    );
            }
            this.sendBtn = false;
        }
    }

    messageSend() {
        if (this.sendBtn) {
            if (this.chatbox && this.chatbox.trim()) {
                const d = new Date();

                this.message[0] = {
                    id: 'waiting',
                    requestMsgSessionId: this.requestMsgSessionId,
                    message: this.chatbox,
                    fromUserId: this.UserId,
                    isUnRead: '',
                    receivedOn: '',
                    receivedOnInUtc:
                        d.getUTCFullYear() +
                        '-' +
                        ((d.getUTCMonth() + 1 < 10 ? '0' : '') +
                            (d.getUTCMonth() + 1)) +
                        '-' +
                        ((d.getUTCDate() < 10 ? '0' : '') + d.getUTCDate()) +
                        'T' +
                        ((d.getUTCHours() < 10 ? '0' : '') + d.getUTCHours()) +
                        ':' +
                        ((d.getUTCMinutes() < 10 ? '0' : '') +
                            d.getUTCMinutes()) +
                        ':' +
                        ((d.getUTCSeconds() < 10 ? '0' : '') +
                            d.getUTCSeconds()) +
                        '.000'
                };
                this.chatmessages[this.chatmessages.length] = this.message[0];
                this.chatbox = '';
                this.scrollast();

                this._messageService
                    .sendMessage(
                        this.message[0].requestMsgSessionId,
                        this.message[0].message
                    )
                    .subscribe(
                        response => {
                            if (response.status === 200) {
                                this.chatmessages[
                                    this.chatmessages.length - 1
                                ].id = 'ok';
                                this.getDeferredLastMsgs();
                                this.message = [];
                                this.sendBtn = true;
                            }
                            this.sendBtn = true;
                        },
                        error => {
                            this.chatmessages[this.chatmessages.length - 1].id =
                                'notok';
                            this.sendBtn = true;
                        }
                    );
                this.sendBtn = false;
            }
        }
    }
}
