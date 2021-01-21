import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SurveyService } from '../../core/services/survey/survey.service';
import { SurveyQuestion } from '../../core/models/survey.question.model';
import { MappingService } from '../../core/services/mapping/mapping.service';
import { Questions } from './questions';
import { Message } from '../../core/models/message';
import { UIService } from '../../core/services/ui/ui.service';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
declare var $;

@Component({
    selector: 'app-survey',
    templateUrl: './survey.component.html',
    styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit, AfterViewInit {

    data;
    choices: string[] = [
        'Strongly Agree',
        'Somewhat Agree',
        'Neutral',
        'Disagree'
    ];

    surveyQuestions: SurveyQuestion[] = [];
    questionsModel = Questions;
    feedback = '';
    hiddenSaveLoader = true;
    isFeedbackHidden = true;
    form: FormGroup;
    radioPadding = 24;
    visibilityLoginSpinner = 'block';
    surveyForm = new FormGroup({
        survey: new FormArray([])
    });
    surveyQues = this.surveyForm.get('survey') as FormArray;

    constructor(
        private _surveyService: SurveyService,
        private _mappingService: MappingService,
        private _uiService: UIService,
        public dialogRef: MatDialogRef<SurveyComponent>,
    ) { }

    ngOnInit() {
        this.form = new FormGroup({
            SQ005Feedback: new FormControl('', [])
        });
        this._surveyService.surveyData.subscribe(resp => {
            console.log('surveyData:', resp);
            this.data = resp;
            this._surveyService.getSurveyQuestions(this.data).subscribe(res => {
                const questions = res.json();
                if (questions.length === 0) {
                    this.dialogRef.close();
                } else {
                    questions.forEach(ques => {
                        this.surveyQuestions.push(
                            this._mappingService.mapSurveyQuestion(ques)
                        );
                    });
                    this.questionsModel = this.questionsModel.filter(q =>
                        this.surveyQuestions
                            .map(x => Object.values(x)[1])
                            .includes(q.code)
                    );
                    const array = new FormArray([]);
                    this.questionsModel.forEach((ques, index) => {
                        ques.id = this.surveyQuestions.filter(
                            q => q.code === ques.code
                        )[0].id;
                        this.surveyQues.push(new FormControl('', Validators.required));
                    });
                    this.visibilityLoginSpinner = 'none';
                    this.isFeedbackHidden =
                        this.surveyQuestions.filter(sq => sq.code === 'SQ-005')
                            .length === 0;

                }
            },err=>{
                this.dialogRef.close();
            });
            // setTimeout(() => {
            //     for (let index = 0; index < this.questionsModel.length; index++) {
            //         $('.radio-survey[data-index="' + index + '"]').css(
            //             'width',
            //             $('th.ng-star-inserted')
            //                 .eq(index)
            //                 .width() + this.radioPadding
            //         );
            //     }
            // }, 1500);
        });
    }
    redirectToHome() {
        this.dialogRef.close();
    }

    submitFeedback() {
        const feedback = this.questionsModel.slice();
        feedback.forEach((ques, index) => {
            ques.answere = this.surveyQues.controls[index].value;
        });
        if (
            this.surveyQuestions.filter(sq => sq.code === 'SQ-005').length !== 0
        ) {
            feedback.push({
                id: this.surveyQuestions.filter(sq => sq.code === 'SQ-005')[0]
                    .id,
                answere: this.form.controls['SQ005Feedback'].value,
                code: 'SQ-005',
                question: this.surveyQuestions.filter(
                    sq => sq.code === 'SQ-005'
                )[0].question,
                surveyId: 0
            });
        }

        this._surveyService
            .postsaveMyAvailability(feedback, this.data.id)
            .subscribe(
                res => {
                    const success = new Message();
                    success.msg = 'Feedback Submitted';
                    success.type = 'success';
                    success.iconType = 'done';
                    this._uiService.showToast(success);
                    this.dialogRef.close();
                },
                err => {
                    const message = new Message();
                    message.msg = err._body;
                    message.type = 'danger';
                    message.iconType = 'error';
                    if (err.status === 401) {
                        message.msg = 'Login session expired';
                    }
                    this._uiService.showToast(message);
                    this.hiddenSaveLoader = true;
                }
            );
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            for (let index = 0; index < this.questionsModel.length; index++) {
                $('.radio-survey[data-index="' + index + '"]').css(
                    'width',
                    $('th.ng-star-inserted')
                        .eq(index)
                        .width() + this.radioPadding
                );
            }
        }, 500);
    }
}
