import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { OpentokService, StreamStatus } from '../../core/services/Opentok/Opentok.service';
import { InviteService } from '../../core/services/invites/invite.service';

@Component({
  selector: 'app-subscriber',
  templateUrl: './subscriber.component.html',
  styleUrls: ['./subscriber.component.css']
})
export class SubscriberComponent implements AfterViewInit, OnDestroy {
    @ViewChild('subscriberDiv', null) subscriberDiv: ElementRef;
    @ViewChild('mic', null) mic: ElementRef;
    @ViewChild('video', null) video: ElementRef;
    @Input() session: OT.Session;
    @Input() stream: OT.Stream;
    isKart :boolean =false;
    @Output() childLoaded = new EventEmitter<boolean>();
    subscriber : OT.Subscriber;
    isMicMuted :boolean = false;
    isVideoOff :boolean = false;
    constructor(private opentokService: OpentokService,
        private inviteService:InviteService) { }

    ngAfterViewInit() {
         this.subscriber = this.session.subscribe(
            this.stream,
            this.subscriberDiv.nativeElement,
            {
                style: {buttonDisplayMode: 'off',
                nameDisplayMode: "off"}
            },
            err => {
                if (err) {
                    // alert(err.message);
                    console.log(err.message);
                }
                console.log('subscriber: ', this.subscriber);
                this.setSubscriberVideo(this.subscriber);
            }
        );
        const s =  JSON.parse(this.subscriber.stream.name);
        this.subscriber.on('videoEnabled', () => {
            const imgData = this.subscriber.getImgData();
            this.subscriber.setStyle('backgroundImageURI', imgData);
            this.subscriber.setStyle('videoDisabledDisplayMode', 'off');
        });
        this.subscriber.on('videoDisabled', () => {
            this.subscriber.setStyle('backgroundImageURI', '');
            this.subscriber.setStyle('videoDisabledDisplayMode', 'on');
        });
        this.subscriber.on('destroyed', () => {
            const status:StreamStatus = new StreamStatus();
            status.isPrimarySpecialist;
            status.isKart;
            status.streamStatus = 'destroyed';
            if(s.isPrimary){
                status.isPrimarySpecialist = true;
                status.isKart = false;
                this.opentokService.SubscriberCommands.next(status);
            }else if(s.name.toLowerCase() == 'patient'){
                status.isPrimarySpecialist = false;
                status.isKart = true;
                this.opentokService.SubscriberCommands.next(status);
            }
        });

        this.subscriber.on('connected', () => {
            const status:StreamStatus = new StreamStatus();
            status.isPrimarySpecialist;
            status.isKart;
            status.streamStatus = 'connected';
            if(s.isPrimary){
                status.isPrimarySpecialist = true;
                status.isKart = false;
                this.opentokService.SubscriberCommands.next(status);
            }else if(s.name.toLowerCase() == 'patient'){
                status.isPrimarySpecialist = false;
                status.isKart = true;
                this.opentokService.SubscriberCommands.next(status);
            }
            //this.opentokService.SubscriberCommands.next('connected');
        });
        // const patient =  JSON.parse(this.subscriber.stream.name);
        if(s.name.toLowerCase() ==  'patient'){
            this.isKart =true;
            this.childLoaded.emit(true);
        }else{
            this.childLoaded.emit(false);
        }
    }

    private setSubscriberVideo(subscriber: OT.Subscriber) {
        console.log('Subscriber:', subscriber);
        if (subscriber.stream.hasVideo) {
            setTimeout(() => {
                const imgData = subscriber.getImgData();
                subscriber.setStyle('backgroundImageURI', imgData);
            }, 500);
        } else {
            subscriber.setStyle('backgroundImageURI', '');
        }
    }

    ngOnDestroy(){
        this.session.unsubscribe(this.subscriber);
        this.subscriber = null;
    }


}
