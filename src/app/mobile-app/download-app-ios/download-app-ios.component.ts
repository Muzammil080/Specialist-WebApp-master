import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import * as vars from "../../app.global";

@Component({
  selector: 'app-download-app-ios',
  templateUrl: './download-app-ios.component.html',
  styleUrls: ['./download-app-ios.component.css']
})
export class DownloadAppIosComponent implements OnInit,AfterViewInit {
    @ViewChild('urlLink') urlLink:ElementRef;
    token;
    currentDate:Date = new Date();
    url;
    appstoreUrl = this.sanitizer.bypassSecurityTrustUrl("https://apps.apple.com/us/app/veedoc/id1289567302");
    version = vars.version;

  constructor(
      private _router:Router,
      private _route:ActivatedRoute,
      private sanitizer: DomSanitizer) { }

  ngOnInit() {

    this._route.queryParams.filter(params=> params.t).subscribe(token=>{
        this.token = token.t;
        //this.url = environment.baseURL + '#/adlogin?t=' + this.token;
        //this.url =  "VeeDoc://" + "https://dev-aws.veemed.com/veedoc/#/adlogin?t=" + this.token;
        this.url = this.sanitizer.bypassSecurityTrustUrl("VeeDoc://" + "adlogin?t=" + this.token);

    });
  }
  ngAfterViewInit(){
    this.urlLink.nativeElement.click();
  }

  toApp(){
    this._router.navigate(['/adlogin'],{queryParams : {t:this.token}});
  }

}
