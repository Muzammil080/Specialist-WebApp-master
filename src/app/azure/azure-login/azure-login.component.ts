import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth.service';
import { UIService } from '../../core/services/ui/ui.service';
import { Router, ActivatedRoute } from '@angular/router';
import { StatusService } from '../../core/services/user/status.service';
import { Message } from '../../core/models/message';
import { User } from '../../core/models/user';
import * as vars from "../../app.global";

@Component({
  selector: 'app-azure-login',
  templateUrl: './azure-login.component.html',
  styleUrls: ['./azure-login.component.css']
})
export class AzureLoginComponent implements OnInit {

  constructor(
    private _authServices: AuthService,
    private _uiServices: UIService,
    private _router: Router,
    private _statusService: StatusService,
    private _route:ActivatedRoute
  ) { }

  user:User;
  currentDate = new Date();
  isLoading:Boolean = true;
  showError:Boolean = false;
  version = vars.version;

  ngOnInit() {
    if (this._authServices.checkToken()) {
        this._router.navigate([""]);
    }

    this._route.queryParams.filter(params=> params.t).subscribe(token=>{
        console.log(token);
        this._authServices.azureLogin(token.t,'AZ_AD').subscribe(
            (response: Response) => {
                if (response.status == 200) {
                    // this.Mainpage = "none";
                    // this.Loginpage= "none";
                    // this.Loadingpage= "none";
                    this._statusService.getStatus().subscribe(
                        response => {

                            this.isLoading = false;
                            this.user = JSON.parse(response._body);
                            this._statusService.setUserInfo(this.user);
                            //this._authServices.storeUser(this.user);

                            if (this.user.userStatus == "Init") {
                                this._router.navigate(["/verification"]);
                            } else if (this.user.userStatus == "Verified") {
                                this._router.navigate(["/verification"]);
                            }
                            // if(this.user.userStatus == "Completed" )
                            else {
                            this._router.navigate([""]);
                                this._authServices.loginStatusChanged.next(
                                    true
                                );
                            }
                        },
                        error => {
                            let msg = new Message();
                            msg.msg =
                                "Something went wrong, please try again.";

                            this._uiServices.showToast(msg);

                            this.isLoading = false;
                            this.showError = true;
                            this._authServices.logoutUser();
                        }
                    );
                }
            },
            error => {
                if (error.status == 400) {
                    let msg = new Message();
                    msg.msg = "Invalid email or password.";

                    this._uiServices.showToast(msg);
                    this.showError = true;
                    this.isLoading = false;
                } else {
                    let msg = new Message();
                    msg.msg = "Something went wrong, please try again.";

                    this._uiServices.showToast(msg);
                    this.showError = true;
                    this.isLoading = false;
                }
            }
        );
    });
  }

}
