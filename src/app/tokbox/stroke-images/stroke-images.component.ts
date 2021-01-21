import { Component, OnInit, Inject, Output, EventEmitter, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { UIService } from '../../core/services/ui/ui.service';
import { PatientInfoService } from '../../core/services/specialist/patientinfo.service';

@Component({
  selector: 'stroke-images',
  templateUrl: './stroke-images.component.html',
  styleUrls: ['./stroke-images.component.css']
})
export class StrokeImagesComponent implements OnInit {
    isLoading :boolean = false;
    images:any;
    selectedImageId;
    @Output() closeStrokeImage = new EventEmitter<boolean>();
    @Input() session;
    constructor(
        private _patientinfoservice: PatientInfoService,
        // @Inject(MAT_DIALOG_DATA) public data: any,
        private _uiService:UIService,
        // public dialogRef: MatDialogRef<StrokeImagesComponent>
        ) {}


  ngOnInit() {
      this.getStrokeImages();
  }

  getStrokeImages(){
    this._patientinfoservice.getStrokeImages().subscribe(res=>{
       this.images = JSON.parse(res._body);
    });
  }
  onImgSelect(img){
    this.selectedImageId = img.id;
    const cmd = '__cmd__;OPEN_NIH_IMAGE ' + img.imageUrl + ';';
    this.sendMessage(cmd);
  }
  close(){
    // this.dialogRef.close();
    const cmd = '__cmd__;CLOSE_NIH_IMAGE;';
    this.sendMessage(cmd);
    this.closeStrokeImage.emit(true);
  }

   /**
     * Sends message
     * @param commandBlock Message commands
     */
    sendMessage(commandBlock: string) {
        console.log(commandBlock);
        this.session.signal(
            {
                data: commandBlock
            },
            function (error) {
                if (error) {
                    console.log(
                        'signal error (' + error.name + '): ' + error.message
                    );
                } else {
                    console.log('signal sent.');
                }
            }
        );
    }

}
