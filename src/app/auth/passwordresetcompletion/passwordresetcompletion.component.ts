import { Component, OnInit, OnDestroy } from '@angular/core'
import { FormGroup, FormControl, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { UIService } from '../../core/services/ui/ui.service'
import { AuthService } from '../../core/services/auth/auth.service'
import { StatusService } from '../../core/services/user/status.service'
import { User } from '../../core/models/user'
import { Router } from '@angular/router';
import { Message } from "../../core/models/message";
import { SecureQuestionsService } from '../../core/services/user/secure-questions.service'
import { PassChangeService } from '../../core/services/user/pass-change.service';
@Component({
    selector: 'passwordreset',
    moduleId: module.id,
    templateUrl: 'passwordresetcompletion.component.html',
    styleUrls: ['passwordresetcompletion.component.css']
})
export class PasswordResetCompletionComponent implements OnInit, OnDestroy {

    form;
    email: string;
    question1: string;
    question2: string;
    answer1: string;
    answer2: string;
    key: string;
    pass;
    passconfirm
    panel = 1;
    submitbutton = "none";
    checkkeybutton = "none";
    checkanserbtn;
    passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[\w~@#$%^&*+=`|{}:;!.?\"()\[\]-]{8,20}$/

    Loadingpage = 'none';
    Loadingtext = 'loading...';
    Loadingbox = 'block';

    //questions
    secretQuestion1;
    secretQuestion2;
    secretAnswer1;
    secretAnswer2;
    constructor(private _questionsService: SecureQuestionsService, private _passChangeService: PassChangeService, private _authServices: AuthService, private _uiServices: UIService, private _router: Router, private _statusService: StatusService) { }


    // secretQuestionMatcher = (control: AbstractControl): { [key: string]: boolean } => {
       
    //     const question1 = this.secretQuestion1;
    //     const question2 = this.secretQuestion2;
    //     if (!question1 || !question2) return null;
    //     return question1 !== question2 ? null : { nomatch: true };
    // };
    secretQuestionMatcher = (control: AbstractControl): { [key: string]: boolean } => {

        const question1 = control.get('secretQuestion1');
        const question2 = control.get('secretQuestion2');

        if (!question1 || !question2) return null;
        return question1.value !== question2.value ? null : { sameQuestions: true };
    };
    secretAnswerMatcher = (control: AbstractControl): { [key: string]: boolean } => {
        const answer1 = control.get('secretAnswer1');
        const answer2 = control.get('secretAnswer2');
       

        if (!answer1 || !answer2) return null;
        return answer1.value !== answer2.value ? null : { sameAnswers: true };

    };
    public noWhitespaceValidator(control: FormControl) {
        let isWhitespace = (control.value || '').trim().length !== (control.value || '').length;
        let isValid = !isWhitespace;
        return isValid ? null : { 'whitespace': true }
    }
    passwordMatcher = (control: AbstractControl): { [key: string]: boolean } => {


        const pass = control.get('pass');
        const passconfirm = control.get('passconfirm');
        if (!pass || !passconfirm) return null;
        return  pass.value === passconfirm.value ? null : { passmatch: true };

         
        
    };

    formgroup() {

        this.form = new FormGroup({
            'email': new FormControl(this.email, []),
            'answer1': new FormControl(this.answer1, []),
            'answer2': new FormControl(this.answer2, []),
            'key': new FormControl(this.key, []),
            'pass': new FormControl(this.pass, []),
            'passconfirm': new FormControl(this.passconfirm, []),
            'secretQuestion1': new FormControl(this.secretQuestion1, []),
            'secretQuestion2': new FormControl(this.secretQuestion2, []),
            'secretAnswer1': new FormControl(this.secretAnswer1, []),
            'secretAnswer2': new FormControl(this.secretAnswer2, [])
        }, Validators.compose([this.passwordMatcher , this.secretQuestionMatcher , this.secretAnswerMatcher])
        );
    }
    panelvalidation() {

        if (this.panel == 1) {
            this.formgroup();
            this.form.controls['email'].setValidators([Validators.required]);
            this.form.updateValueAndValidity();

        }

        else if (this.panel == 2) {
            this.formgroup();
            this.form.controls['answer1'].setValidators([Validators.required]);
            this.form.controls['answer2'].setValidators([Validators.required]);

            this.form.updateValueAndValidity();
            this.checkanserbtn = 'none';
            this.checkkeybutton = 'initial';
            // this.submitbutton="initial";
        }

        else if (this.panel == 3) {
            this.formgroup();
            this.form.controls['secretQuestion1'].setValidators([Validators.required]);
            this.form.controls['secretQuestion2'].setValidators([Validators.required]);
            this.form.controls['secretAnswer1'].setValidators([Validators.required, Validators.minLength(5), Validators.maxLength(20),  this.noWhitespaceValidator]);
            this.form.controls['secretAnswer2'].setValidators([Validators.required, Validators.minLength(5), Validators.maxLength(20), this.noWhitespaceValidator]);


            this.form.controls['key'].setValidators([Validators.required]);
            this.form.controls['pass'].setValidators([Validators.required, Validators.maxLength(20), Validators.pattern(this.passwordPattern)]);
            this.form.controls['passconfirm'].setValidators([Validators.required]);
            this.form.updateValueAndValidity();
            this.checkanserbtn = 'none';
            this.checkkeybutton = 'none';
            this.submitbutton = "initial";
        }

    }
    secretQuestions = null;
    ngOnInit(): void {

        let isLoggedIn = this._authServices.checkToken()
        if (isLoggedIn) {
            this._router.navigate(['home']);
        }

        this._questionsService.getSecretQuestions().subscribe(
            (response) => this.secretQuestions = JSON.parse(response._body),
            (error) => { }
        );
        this.panel = 3;
        this.formgroup()
        this.panelvalidation()


    }
    ngOnDestroy() {
        //this.subscription.unsubscribe();
    }

    checkanswer() {
        this.Loadingpage = 'block';
        this.Loadingtext = 'Checking.....';
        this.Loadingbox = 'none';
        this._passChangeService.checkanswers(this.email, this.answer1, this.answer2).subscribe((res) => {

            this.Loadingpage = 'none';
            this.Loadingtext = 'Checking.....';
            this.Loadingbox = 'block';
            this.panel = 3;
            this.panelvalidation();

        },
            (err) => {
                this.Loadingpage = 'none';
                this.Loadingtext = 'Checking.....';
                this.Loadingbox = 'block';

                let msg = new Message();
                msg.msg = "Invalid Answers"
                msg.iconType = 'info';
                this._uiServices.showToast(msg);
            });

    }


    changepass() {
        this.Loadingpage = 'block';
        this.Loadingtext = 'Updating.....';
        this.Loadingbox = 'none';
        this._passChangeService.verifyandchangequestion(this.key.trim().toString(), this.pass, this.secretQuestion1, this.secretQuestion2, this.secretAnswer1, this.secretAnswer2).subscribe((res) => {

            this.Loadingpage = 'none';
            this.Loadingtext = 'Updating.....';
            this.Loadingbox = 'block';
            let msg = new Message();
            msg.msg = "Password Successfully Updated"
            msg.type = 'success';
            msg.iconType = 'check_circle';
            this._uiServices.showToast(msg);

            this._router.navigate(['/login']);

        },
            (err) => {
                this.Loadingpage = 'none';
                this.Loadingtext = 'Updating.....';
                this.Loadingbox = 'block';
                let msg = new Message();
                msg.msg = "Invalid Verification Code"
                msg.iconType = 'info';
                this._uiServices.showToast(msg);
            });
    }

    resetpass() {
        this.Loadingpage = 'block';
        this.Loadingtext = 'Checking.....';
        this.Loadingbox = 'none';
        this._passChangeService.getUserQuestions(this.email).subscribe((res) => {


            var questions = JSON.parse(res._body);
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
                let msg = new Message();
                msg.msg = "Invalid Email Address"
                msg.iconType = 'info';
                this._uiServices.showToast(msg);

            }

        },
            (err) => {
                this.Loadingpage = 'none';
                this.Loadingtext = 'Checking.....';
                this.Loadingbox = 'block';
                let msg = new Message();
                msg.msg = "Somthing went wrong Please try again"
                msg.iconType = 'info';
                this._uiServices.showToast(msg);
            });


    }
}
