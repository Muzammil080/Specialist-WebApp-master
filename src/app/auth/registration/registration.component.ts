import { Component, OnInit } from '@angular/core';
import {
    FormGroup,
    FormControl,
    Validators,
    AbstractControl
} from '@angular/forms';

import { AuthService } from '../../core/services/auth/auth.service';
import { User } from '../../core/models/user';
import { UIService } from '../../core/services/ui/ui.service';
import { StatusService } from '../../core/services/user/status.service';
import { Router } from '@angular/router';
import { Message } from '../../core/models/message';

@Component({
    moduleId: module.id,
    templateUrl: 'registration.component.html',
    styleUrls: ['registration.component.css']
})
export class RegistrationComponent implements OnInit {
    public mask = [
        '(',
        /[1-9]/,
        /\d/,
        /\d/,
        ')',
        ' ',
        /\d/,
        /\d/,
        /\d/,
        '-',
        /\d/,
        /\d/,
        /\d/,
        /\d/
    ];
    // patternemail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    patternname = /^[A-Za-z,' ']+$/;

    credentials = [
        { value: 'M.D.' },
        { value: 'D.O.' },
        { value: 'R.N.' },
        { value: 'P.A-C' },
        { value: 'F.N.P' },
        { value: 'N.P-C' },
        { value: 'P.A' },
        { value: 'A.C.N.P' },
        { value: 'AG-A.C.N.P' },
        { value: 'C.I.C' },
        { value: 'N/A' }
    ];
    titles = [
        { value: 'Physician' },
        { value: 'Manager' },
        { value: 'Director' },
        { value: 'CIO' },
        { value: 'Nurse Practitioner' },
        { value: 'Physician Assistant' },
        { value: 'Social Worker' },
        { value: 'IT' },
        { value: 'PM' },
        { value: 'CFO' },
        { value: 'CEO' },
        { value: 'CSO' },
        { value: 'None' }
    ];

    user: User = new User();
    successResponse: any;
    errorResponse: any;
    //  disable: boolean = false
    avialableEmail: boolean = true;

    signin: boolean;
    dopattern = /[.]/;
    phonePattern = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[\w~@#$%^&*+=`|{}:;!.?\"()\[\]-]{8,20}$/;

    Loadingpage = 'none';
    Registrationpage = 'block';

    public noWhitespaceValidator(control: FormControl) {
        let isWhitespace =
            (control.value || '').trim().length !==
            (control.value || '').length;
        let isValid = !isWhitespace;
        return isValid ? null : { 'whitespace': true };
    }

    passwordMatcher = (
        control: AbstractControl
    ): { [key: string]: boolean } => {
        const password = control.get('password');
        const confirmPassword = control.get('confirmPassword');
        if (!password || !confirmPassword) return null;
        return password.value === confirmPassword.value
            ? null
            : { nomatch: true };
    };
    form = new FormGroup(
        {
            'credentials': new FormControl(this.user.credentials, [
                Validators.required
            ]),
            'lastName': new FormControl(this.user.lastName, [
                Validators.required,
                this.noWhitespaceValidator,
                Validators.pattern(this.patternname)
            ]),
            'firstName': new FormControl(this.user.firstName, [
                Validators.required,
                this.noWhitespaceValidator,
                Validators.pattern(this.patternname)
            ]),
            'email': new FormControl(this.user.email, [
                Validators.required,
                Validators.email
            ]),
            'title': new FormControl(this.user.title, [Validators.required]),
            'mobileNumber': new FormControl(this.user.mobileNumber, [
                Validators.required,
                Validators.pattern(this.phonePattern)
            ]),
            'password': new FormControl(this.user.password, [
                Validators.required,
                Validators.maxLength(20),
                Validators.pattern(this.passwordPattern)
            ]),
            'confirmPassword': new FormControl(this.user.confirmPassword, [
                Validators.required
            ])
        },
        this.passwordMatcher
    );
    constructor(
        private _authServices: AuthService,
        private _router: Router,
        private _uiServices: UIService,
        private _statusService: StatusService
    ) { }
    register(): void {


        if (this.form.controls.email.value.length > 0) {
            // tslint:disable-next-line: max-line-length
            const emailregex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


            if (!emailregex.test(this.form.controls.email.value)) {
                this.form.controls.email.setErrors({
                    'incorrect': true
                });
            }

            this.form.updateValueAndValidity();
        }

        if (!this.form.valid) {
            return;
        }

        this.Loadingpage = 'block';
        this.Registrationpage = 'none';

        let previousnumber = this.user.mobileNumber;
        let number = this.user.mobileNumber;
        let formatenumber = number.replace(/[- )(]/g, '');
        this.user.mobileNumber = '+1' + formatenumber;
        this.user.email = this.user.email.toLocaleLowerCase().trim();
        this._authServices.register(this.user).subscribe(
            (response: Response) => {
                if (response.status == 200) {
                    this._authServices.checkLogin(this.user).subscribe(
                        (response: Response) => {
                            if (response.status == 200) {
                                // this.Mainpage = "none";
                                // this.Loginpage= "none";
                                // this.Loadingpage= "none";
                                this._statusService.getStatus().subscribe(
                                    response => {
                                        this.user = JSON.parse(response._body);

                                        // this._authServices.storeUser(this.user);
                                        this.successResponse = response;

                                        this._router.navigate(['verification']);
                                        this.Loadingpage = 'none';
                                        this.Registrationpage = 'none';
                                    },
                                    error => { }
                                );
                            }
                        },
                        (error: Response) => {
                            let msg = new Message();
                            msg.msg = 'Something went wrong, please try again.';

                            this._uiServices.showToast(msg);

                            this.Loadingpage = 'none';
                        }
                    );
                }
            },
            (error: Response) => {
                this.user.mobileNumber = previousnumber;
                let msg = new Message();
                msg.msg = 'Something went wrong, please try again.';
                //    msg.title=""
                //    msg.iconType=""
                this._uiServices.showToast(msg);
                this.Loadingpage = 'none';
                this.Registrationpage = 'block';
                this.errorResponse = error;
            }
        );
    }
    signinroute() {
        this._authServices.signinstatus(true);
        this._router.navigate(['login']);
    }
    ngOnInit(): void {
        this._authServices.currentMessage.subscribe(
            value => (this.signin = value)
        );
        let isLoggedIn = this._authServices.checkToken();
        if (isLoggedIn) {
            this._router.navigate(['home']);
        }
    }

    verifyEmail(): void {
        let email = this.user.email;
        if (
            typeof email === 'undefined'
        ) {
            return;
        }
        this._authServices.verifyEmail(email).subscribe(
            response => {
                this.avialableEmail = response.text() === 'true';
                if (!this.avialableEmail) {
                    this.form.controls.email.setErrors({ notavailable: true });
                }
            },
            error => { }
        );
    }
}
