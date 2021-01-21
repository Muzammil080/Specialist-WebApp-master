import { Component, OnInit, OnChanges } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { User } from '../../core/models/user';
import { UIService } from '../../core/services/ui/ui.service';
import { StatusService } from '../../core/services/user/status.service';
import { Message } from '../../core/models/message';
import { Observable } from 'rxjs/Rx';
import {
    Location,
    LocationStrategy,
    PathLocationStrategy
} from '@angular/common';
@Component({
    moduleId: module.id,
    templateUrl: 'verification.component.html',
    styleUrls: ['verification.component.css']
})
export class VerificationComponent implements OnInit {
    timeLeft = 10;
    interval;
    backenabled = false;

    verificationCode: string;
    successResponse: any;
    failedResponse: any;

    showCompletationForm = false;
    disableButton = false;

    Loadingpage = 'none';
    Verificationpage = 'block';
    user: User = new User();

    constructor(
        private _authService: AuthService,
        private location: Location,
        private _router: Router,
        private _uiService: UIService,
        private _statusService: StatusService
    ) { }

    canDeactivate(): boolean | Observable<boolean> | Promise<boolean> {
        this.location.forward();

        setInterval(() => {
            this.location.forward();
        }, 100);

        return this.backenabled;
    }

    verify(): void {
        if (this.verificationCode) {
            this.Loadingpage = 'block';
            this.Verificationpage = 'none';

            this.disableButton = true;
            this._authService
                .verifyKey(this.verificationCode.trim().toString())
                .subscribe(
                    response => {
                        if (response.status == 200) {
                            this._statusService.getStatus().subscribe(
                                response => {
                                    this.user = JSON.parse(response._body);
                                    this._statusService.setUserInfo(this.user);
                                    //  this.user = JSON.parse(response._body);
                                    // this._authService.loginStatusChanged.next(true);
                                },
                                error => { }
                            );

                            this.backenabled = true;
                            this.successResponse = JSON.parse(response._body);
                            this.disableButton = false;
                            this.showCompletationForm = true;
                        }
                    },
                    error => {
                        this.failedResponse = 'Invalid key';
                        this.disableButton = false;
                        this.Loadingpage = 'none';
                        this.Verificationpage = 'block';
                    }
                );
        } else {
            this.failedResponse = 'Verification code is required.';
        }
    }

    startTimer() {
        this.interval = setInterval(() => {
            if (this.timeLeft > 0) {
                this.timeLeft--;
            } else {
                clearInterval(this.interval);
                // this.timeLeft = 10;
            }
        }, 1000);
    }

    ngOnInit() {
        this.startTimer();
        this.Verificationpage = 'none';
        this._statusService.getStatus().subscribe(
            response => {
                this.user = JSON.parse(response._body);

                // this._authServices.storeUser(this.user);

                if (this.user.userStatus == 'Init') {
                    this._router.navigate(['/verification']);
                    this.Verificationpage = 'block';
                } else if (this.user.userStatus == 'Verified') {
                    this.backenabled = true;
                    this.successResponse = this.user;
                    this.showCompletationForm = true;
                } else {
                    this._router.navigate(['']);
                    this._authService.loginStatusChanged.next(true);
                }
                // }else if(this.user.userStatus == "Completed" )
                // {
                //     this._router.navigate(['/home']);
                //    // this._authServices.loginStatusChanged.next(true);
                // }
            },
            error => {
                const msg = new Message();
                msg.msg = 'Something went wrong, please try again.';
            }
        );
    }
    logout() {
        this.backenabled = true;
        this._authService.logoutUser();
    }

    resend() {
        this._authService.resendEmail(this.user).subscribe(res => {
            if (res.status === 200) {
                const message = new Message();
                message.msg = 'Verification code sent';
                message.type = 'info';
                message.iconType = 'info';
                this._uiService.showToast(message);
                this.timeLeft = 10;
                this.startTimer();
            }
        });
    }
}
