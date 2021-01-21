require('pdfjs-dist')
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Inject, Component } from "@angular/core";

@Component({
    selector: 'simple-pdf-viewer',
    templateUrl: 'simplePdfViewer.component.html',
    styleUrls:['simplePdfViewer.component.css']
  })
  export class SimplePdfViewerComponent {
  
    constructor(
      public dialogRef: MatDialogRef<SimplePdfViewerComponent>,
      @Inject(MAT_DIALOG_DATA) public data) {}
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  
  }