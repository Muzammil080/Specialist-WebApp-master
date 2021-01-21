import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild, Input } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { OpentokService } from '../../core/services/Opentok/Opentok.service';
import { PublisherCommands } from '../../core/models/tokboxObjects';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-publisher',
  templateUrl: './publisher.component.html',
  styleUrls: ['./publisher.component.css']
})
export class PublisherComponent implements AfterViewInit, OnDestroy {
    @ViewChild('publisherDiv', null) publisherDiv: ElementRef;
    @Input() session: OT.Session;
    publisher: OT.Publisher;
    publishing: Boolean;
    devicesInterval = null;
    notifier = new Subject(); //to be used with take untill to unsubscribe in ng on destroy
    userFullName;
    constructor(private opentokService: OpentokService
        // private videoEffectsService:VideoEffectsService
        ) {
        this.publishing = false;
    }

    ngAfterViewInit() {
        this.userFullName =  sessionStorage.getItem('userFullName');
        const OT = this.opentokService.getOT();
        const specialist : any = {};
        specialist.name = this.userFullName;
        specialist.isPrimary = false;
        this.publisher = OT.initPublisher(this.publisherDiv.nativeElement, {
            // insertMode: 'append',
            publishAudio : false,
            publishVideo : false,
            style: {buttonDisplayMode: 'off',
            nameDisplayMode: "off"},
            name: JSON.stringify(specialist)
            // videoSource: this.videoEffectsService.canvas.captureStream().getVideoTracks()[0]
        });

        if (this.session) {
            if (this.session['isConnected']()) {
                this.publish();
            }
            this.session.on('sessionConnected', () => this.publish());
        }

        this.opentokService.PublisherCommands.pipe(takeUntil(this.notifier)).subscribe(
            (command: PublisherCommands) => {
                if (command.type === 'microphonePrivacy') {
                    this.publisher.publishAudio(!command.value);
                } else if (command.type === 'cameraPrivacy') {
                    this.publisher.publishVideo(!command.value);
                }
            }
        );
        this.publisher.on('mediaStopped', () => {
            let hasAudio: boolean, hasVideo: boolean;
            console.log('mediaStopped called');
            if (this.devicesInterval === null) {
                this.devicesInterval = setInterval(() => {
                    OT.getDevices(async (err, devices) => {
                        if (err) {
                            console.log(err);
                        } else {
                            const audioInputs = devices.filter(
                                device => device.kind === 'audioInput'
                            );
                            const videoInputs = devices.filter(
                                device => device.kind === 'videoInput'
                            );

                            if (videoInputs.length < 1) {
                                console.log('no camera module found.');
                                hasVideo = false;
                            } else {
                                hasVideo = true;
                                clearInterval(this.devicesInterval);
                                this.devicesInterval = null;
                                this.publisher.destroy();
                                this.ngAfterViewInit();
                            }

                            if (audioInputs.length < 1) {
                                console.log('microphone not found.');
                                hasAudio = false;
                            } else {
                                const stream = await OT.getUserMedia({
                                    videoSource: null
                                });

                                const [audioSource] = stream.getAudioTracks();
                                this.publisher
                                    .setAudioSource(audioSource)
                                    .then(() => console.log('Audio source updated'));
                            }
                            if (hasAudio && hasVideo) {
                                clearInterval(this.devicesInterval);
                            }
                        }
                    });
                }, 2000);
            }
        });
    }

    ngOnDestroy(){
        console.log("on destroy publisher called");
        this.notifier.next();
        this.notifier.complete();
        // this.videoEffectsService.stopExistingVideoCapture();
        this.publisher.destroy();
        this.publisher = null;
    }

    publish() {
        this.session.publish(this.publisher, err => {
            if (err) {
                console.log(err.message);
                // alert(err.message);
            } else {
                this.publishing = true;
            }
        });
    }
}
