import { Component, OnInit, OnDestroy } from '@angular/core';
import {
    FormGroup,
    FormControl,
    Validators,
    AbstractControl
} from '@angular/forms';
import { UIService } from '../../core/services/ui/ui.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { Message } from '../../core/models/message';

import { PassChangeService } from '../../core/services/user/pass-change.service';
@Component({
    selector: "passwordreset",
    moduleId: module.id,
    templateUrl: 'passwordreset.component.html',
    styleUrls: ['passwordreset.component.css']
})
export class PasswordResetComponent implements OnInit, OnDestroy {
    form: FormGroup;
    email: string;
    question1: string;
    question2: string;
    answer1: string;
    answer2: string;
    key: string;
    pass;
    passconfirm;
    panel = 1;
    submitbutton = 'none';
    checkkeybutton = 'none';
    checkanserbtn;
    passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[\w~@#$%^&*+=`|{}:;!.?\"()\[\]-]{8,20}$/;

    Loadingpage = 'none';
    Loadingtext = 'loading...';
    Loadingbox = 'block';

    constructor(
        private _passChangeService: PassChangeService,
        private _authServices: AuthService,
        private _uiServices: UIService,
        private _router: Router) { }

    passwordMatcher = (
        control: AbstractControl
    ): { [key: string]: boolean } => {
        const pass = control.get('pass');
        const passconfirm = control.get('passconfirm');
        if (!pass || !passconfirm) { return null; }
        return pass.value === passconfirm.value ? null : { nomatch: true };
    }

    formgroup() {
        this.form = new FormGroup(
            {
                email: new FormControl('', []),
                answer1: new FormControl('', []),
                answer2: new FormControl('', []),
                key: new FormControl('', []),
                pass: new FormControl('', []),
                passconfirm: new FormControl('', [])
            },
            this.passwordMatcher
        );
    }
    panelvalidation() {
        if (this.panel === 1) {
            this.formgroup();
            this.form.controls['email'].setValidators([Validators.required]);
            this.form.updateValueAndValidity();
        } else if (this.panel === 2) {
            this.formgroup();
            this.form.controls['answer1'].setValidators([Validators.required]);
            this.form.controls['answer2'].setValidators([Validators.required]);

            this.form.updateValueAndValidity();
            this.checkanserbtn = 'none';
            this.checkkeybutton = 'initial';
            // this.submitbutton="initial";
        } else if (this.panel === 3) {
            this.formgroup();
            this.form.controls['key'].setValidators([Validators.required]);
            this.form.controls['pass'].setValidators([
                Validators.required,
                Validators.maxLength(20),
                Validators.pattern(this.passwordPattern)
            ]);
            this.form.controls['passconfirm'].setValidators([
                Validators.required
            ]);
            this.form.updateValueAndValidity();
            this.checkanserbtn = 'none';
            this.checkkeybutton = 'none';
            this.submitbutton = 'initial';
        }
    }

    ngOnInit(): void {
        const isLoggedIn = this._authServices.checkToken();
        if (isLoggedIn) {
            this._router.navigate(['home']);
        }

        this.panel = 1;
        this.formgroup();
        this.panelvalidation();
    }
    ngOnDestroy() {
        // this.subscription.unsubscribe();
    }

    checkanswer() {
        this.Loadingpage = 'block';
        this.Loadingtext = 'Checking.....';
        this.Loadingbox = 'none';
        this._passChangeService
            .checkanswers(this.email, this.answer1, this.answer2)
            .subscribe(
                res => {
                    this.Loadingpage = 'none';
                    this.Loadingtext = 'Checking.....';
                    this.Loadingbox = 'block';
                    this.panel = 3;
                    this.panelvalidation();
                },
                err => {
                    this.Loadingpage = 'none';
                    this.Loadingtext = 'Checking.....';
                    this.Loadingbox = 'block';

                    const msg = new Message();
                    msg.msg = 'Invalid Answers';
                    msg.iconType = 'info';
                    this._uiServices.showToast(msg);
                }
            );
    }

    changepass() {
        this.Loadingpage = 'block';
        this.Loadingtext = 'Updating.....';
        this.Loadingbox = 'none';
        this._passChangeService
            .verifyandchange(this.key.trim().toString(), this.pass)
            .subscribe(
                res => {
                    this.Loadingpage = 'none';
                    this.Loadingtext = 'Updating.....';
                    this.Loadingbox = 'block';
                    const msg = new Message();
                    msg.msg = 'Password Changed Successfully';
                    msg.type = 'success';
                    msg.iconType = 'check_circle';
                    this._uiServices.showToast(msg);

                    this._router.navigate(['/login']);
                },
                err => {
                    this.Loadingpage = 'none';
                    this.Loadingtext = 'Updating.....';
                    this.Loadingbox = 'block';
                    const msg = new Message();
                    msg.msg = 'Invalid Verification Code';
                    msg.iconType = 'info';
                    this._uiServices.showToast(msg);
                }
            );
    }

    resetpass() {
        this.Loadingpage = 'block';
        this.Loadingtext = 'Checking.....';
        this.Loadingbox = 'none';
        this._passChangeService.getUserQuestions(this.email).subscribe(
            res => {
                let questions = JSON.parse(res._body);
                if (questions[0]) {
                    this.Loadingpage = 'none';
                    this.Loadingtext = 'Checking.....';
                    this.Loadingbox = 'block';
                    this.question1 = questions[0];
                    this.question2 = questions[1];
                    this.panel = 2;
                    this.panelvalidation();
                } else {
                    this.Loadingpage = 'none';
                    this.Loadingtext = 'Checking.....';
                    this.Loadingbox = 'block';
                    const msg = new Message();
                    msg.msg = 'Invalid Email Address';
                    msg.iconType = 'info';
                    this._uiServices.showToast(msg);
                }
            },
            err => {
                this.Loadingpage = 'none';
                this.Loadingtext = 'Checking.....';
                this.Loadingbox = 'block';
                const msg = new Message();
                msg.msg = 'Somthing went wrong Please try again';
                msg.iconType = 'info';
                this._uiServices.showToast(msg);
            }
        );
    }
}
