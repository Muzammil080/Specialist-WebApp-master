import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-download-app-android',
  templateUrl: './download-app-android.component.html',
  styleUrls: ['./download-app-android.component.css']
})
export class DownloadAppAndroidComponent implements OnInit {

    @ViewChild('urlLink') urlLink: ElementRef;

    url;
    playStoreUrl = "https://play.google.com/store/apps/details?id=com.veemed.veedoc";

    constructor(
        private _route: ActivatedRoute,
        private sanitizer: DomSanitizer
    ) { }

    ngOnInit() {

        this._route.queryParams.filter(params=> params.t).subscribe(urlToken=>{
            let token = urlToken.t;
            this.url = this.sanitizer.bypassSecurityTrustUrl("VeeDoc://" + "adlogin?t=" + token);

            setTimeout(()=>{
                window.location.href = this.playStoreUrl;
                return false;
            }, 500);
            this.generateClick();
        });
    }
    ngAfterViewInit(){
        this.generateClick();
    }

    generateClick() {
        this.urlLink.nativeElement.click();
    }
}
