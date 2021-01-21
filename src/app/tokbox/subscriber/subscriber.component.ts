import {
    Component,
    ElementRef,
    AfterViewInit,
    ViewChild,
    Input,
    EventEmitter,
    Output,
    OnDestroy, ChangeDetectorRef, AfterViewChecked, AfterContentChecked
} from '@angular/core';
import * as OT from '@opentok/client';
import { OpentokService } from '../../core/services/Opentok/Opentok.service';
import { InviteService } from '../../core/services/invites/invite.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

@Component({
    selector: 'app-subscriber',
    templateUrl: './subscriber.component.html',
    styleUrls: ['./subscriber.component.css']
})
export class SubscriberComponent implements AfterViewInit,OnDestroy,AfterViewChecked,AfterContentChecked {
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
    name:string;
    notifier = new Subject(); //to be used with take untill to unsubscribe in ng on destroy
    isStroke = false; //bool value to be changed from tokbox
    streamName;
    constructor(private opentokService: OpentokService,
        private inviteService:InviteService,
        private cdr: ChangeDetectorRef) { }

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
            if(this.isKart){
                this.opentokService.SubscriberCommands.next('destroyed');
            }
        });

        this.subscriber.on('connected', () => {
            this.opentokService.SubscriberCommands.next('connected');
        });
        if(!this.subscriber.stream.name){
            this.isKart =true;
            this.childLoaded.emit(true);
            console.log("for old karts");
            this.opentokService.SubscriberCommands.next('hideinvite');
        }else{
            try{
                this.streamName =  JSON.parse(this.subscriber.stream.name);
                this.name = this.streamName.name;
                console.log(this.streamName ,"patient");
                if(this.streamName .name.toLowerCase() ==  'patient'){
                    this.isKart =true;
                    this.childLoaded.emit(true);
                }else{
                    this.childLoaded.emit(false);
                }
            }catch(ex){
                this.name= 'patient';
                this.isKart = true;
                this.childLoaded.emit(true);
                this.opentokService.SubscriberCommands.next('hideinvite');
            }


        }

        this.opentokService.MuteCommands.pipe(takeUntil(this.notifier)).subscribe((ev : any)=>{

            if(ev.stream.streamId == this.stream.streamId){
                if(ev.changedProperty == 'hasAudio'){
                    this.isMicMuted = !ev.newValue;
                }else if(ev.changedProperty == 'hasVideo'){
                    this.isVideoOff = !ev.newValue;
                }
            }
        });
        this.opentokService.StrokeCommands.pipe(takeUntil(this.notifier)).subscribe((d : boolean)=>{
           this.isStroke = d;
        });

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

    showcustomUi(){
        if(this.name){
            if(this.name.toLowerCase() == 'patient' || this.name.toLowerCase().includes('scope')){
                return false;
            }
        }
        if(this.subscriberDiv.nativeElement.classList.contains('subscriber')){
            return true;
        }else{
            return false;
        }
    }
    showName(){
        if(this.subscriberDiv.nativeElement.classList.contains('subscriber')){
            return true;
        }else{
            return false;
        }
    }

    micToggle(){
        if(this.isMicMuted){
            this.sendCommand('unmute');
        }else{
            this.sendCommand('mute');
        }
    }

    videoToggle(){
        if(this.isVideoOff){
            this.sendCommand('videoon');
        }else{
            this.sendCommand('videooff');
        }

    }

    block(){
        this.sendCommand('block');
    }

    //connection.data has inviteguid
    sendCommand(action)
    {
        let cmd;
        let signalSent =false;
        if(action == 'mute'){
            cmd ='__cmd__;Mute';
        }else if(action =='unmute'){
            cmd = '__cmd__;Unmute';
        }else if(action == 'videoon'){
            cmd = '__cmd__;VideoOn';
        }else if(action == 'videooff'){
            cmd = '__cmd__;VideoOff';
        }else if(action == 'block'){
            cmd = '__cmd__;Block';
        }

        this.session.signal(
            {
                data: cmd,
                to:this.subscriber.stream.connection
            },
            function (error) {
                if (error) {
                    console.log(
                        'signal error (' + error.name + '): ' + error.message
                    );
                } else {
                    signalSent = true;
                    console.log('signal sent.');
                }
            }
        );
        setTimeout(()=>{
            if(signalSent){
                if(action == 'mute'){
                    this.inviteService.MuteMic(this.subscriber.stream.connection.data,true)
                    .subscribe(d=>{
                        this.isMicMuted= true;
                    });
                }else if(action =='unmute'){
                    this.inviteService.MuteMic(this.subscriber.stream.connection.data,false)
                    .subscribe(d=>{
                        this.isMicMuted= false;
                    });
                }else if(action == 'videoon'){
                    this.inviteService.MuteCamera(this.subscriber.stream.connection.data,false)
                    .subscribe(d=>{
                        console.log('videoon');
                        this.isVideoOff = false;
                    });
                }else if(action == 'videooff'){
                    this.inviteService.MuteCamera(this.subscriber.stream.connection.data,true)
                    .subscribe(d=>{
                        console.log('videooff');
                        this.isVideoOff = true;
                    });
                }else if(action == 'block'){
                    this.inviteService.Block(this.subscriber.stream.connection.data)
                    .subscribe(d=>{
                        console.log('block');
                    });
                }
            }
        },500);

    }

    ngOnDestroy(){
        this.notifier.next();
        this.notifier.complete();
    }
    isStrokeON(){
        if((this.subscriberDiv.nativeElement.classList.contains('primary')
         || this.subscriberDiv.nativeElement.classList.contains('primarysin'))
         && this.isStroke){
            return true;

        }else{
            return false;
        }

    }
    ngAfterViewChecked(){
        // this.cdr.detectChanges();
    }
    ngAfterContentChecked(){
        this.cdr.detectChanges();
    }
}
