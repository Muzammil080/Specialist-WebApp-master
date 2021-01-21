import { Injectable } from '@angular/core';
import { HttpService } from '../base/http.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { SurveyQuestion } from '../../models/survey.question.model';

@Injectable({
    providedIn: 'root'
})
export class SurveyService {

    surveyData = new BehaviorSubject<any>({});

    constructor(private _http: HttpService) { }


    getSurveyQuestions(data: any) {
        return this._http
            .get('survey/question/list/' + data.id + '/' + data.surveyType + '/' + data.forApplication)
            .catch((err, caught) => {
                return Observable.throw(err);
            });
    }

    postsaveMyAvailability(surveyQuestions: SurveyQuestion[], sessionId: number): Observable<any> {
        const body = {
            id: 0,
            requestId: sessionId,
            submittedById: 0,
            endpointId: 0,
            surveyFeedbackDetails: []
        };
        surveyQuestions.forEach(sq => {
            body.surveyFeedbackDetails.push({
                id: 0,
                surveyFeedbackId: 0,
                questionId: sq.id,
                feedback: sq.answere
            });
        });
        return this._http
            .post('survey/feedback/add', body)
            .catch((err, caught) => {
                return Observable.throw(err);
            });
    }
}
