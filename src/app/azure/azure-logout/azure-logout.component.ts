import { Component, OnInit } from '@angular/core';
import * as vars from "../../app.global";

@Component({
  selector: 'app-azure-logout',
  templateUrl: './azure-logout.component.html',
  styleUrls: ['./azure-logout.component.css']
})
export class AzureLogoutComponent implements OnInit {
  version= vars.version;
  currentDate = new Date();
  constructor() { }

  ngOnInit() {
  }

}
