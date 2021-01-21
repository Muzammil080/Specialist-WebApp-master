import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { MalihuScrollbarService } from 'ngx-malihu-scrollbar';

@Component({
  selector: 'app-lab-reports',
  templateUrl: './lab-reports.component.html',
  styleUrls: ['./lab-reports.component.css']
})
export class LabReportsComponent implements OnInit, AfterViewInit, OnDestroy {
  showMsgBox = true;
  showLoader = false;
  darkScrollbarOptions = { axis: 'y', theme: 'dark' };
  constructor(private mScrollbarService: MalihuScrollbarService) {}

  ngOnInit() {}

  getReport() {
    this.showMsgBox = false;
  }
  ngAfterViewInit(): void {
    this.mScrollbarService.initScrollbar('#sidebar', {
      axis: 'y',
      theme: 'dark'
    });
  }
  ngOnDestroy(): void {
    this.mScrollbarService.destroy('#sidebar');
  }
}
