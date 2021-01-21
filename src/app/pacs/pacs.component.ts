import {
    Component,
    OnInit,
    OnDestroy,
    EventEmitter,
    Output
} from '@angular/core';
import {
    PatientInfoService,
    PatientInfo
} from '../core/services/specialist/patientinfo.service';
import { Pacs } from '../core/main';

@Component({
    selector: 'pacs',
    templateUrl: 'pacs.component.html',
    styleUrls: ['pacs.component.css']
})
export class PacsComponent implements OnInit, OnDestroy {
    @Output() refeshPacs = new EventEmitter();

    patientInfo: PatientInfo;
    imgPath;
    patientId: number;
    patientStudies;

    showLoader = false;
    showMsgBox = true;
    showPacsViewer = false;

    public scrollbarOptions = { axis: 'y', theme: 'minimal-dark' };
    constructor(
        private _patientinfoservice: PatientInfoService,
        private viewer: Pacs
    ) {}

    ngOnInit(): void {
        console.log('pacs Oninit');
        this.imgPath = '/assets/ct/1.jpg';
        // find patient study
        this._patientinfoservice.receivepatientStudy().subscribe(data => {
            console.log(data);
            this.patientStudies = data;
        });
    }

    ngOnDestroy() {}

    webViewer() {
        this.viewer.findPatients();
    }

    imgOnClick(id) {
        this.imgPath = '/assets/ct/' + id + '.jpg';
    }

    getSeries(series) {
        this.showMsgBox = false;
        this.showPacsViewer = true;
        console.warn('showpacsviewer:', this.showPacsViewer);
        if (series.InstanceUID != null && !series.disabled) {
            this.patientStudies.forEach(s => {
                if (s.InstanceUID === series.InstanceUID) {
                    s.disabled = true;
                }
            });
            console.log(this.patientStudies);
            this.viewer.findSeries(series.InstanceUID);
            this.viewer.showSeries(series.InstanceUID);
        }
    }
    resetPacsState() {
        this.refeshPacs.emit();
    }
}
