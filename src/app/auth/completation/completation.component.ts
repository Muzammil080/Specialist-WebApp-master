import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { User } from '../../core/models/user';
import { Specialist } from '../../core/models/specialist.model';
import { GeoLocationService } from '../../core/services/location/geo-location.service';
import { SpecialistService } from '../../core/services/specialist/specialist.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { SecureQuestionsService } from '../../core/services/user/secure-questions.service';
import { MatOptionSelectionChange } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import { UIService } from '../../core/services/ui/ui.service';
import { Message } from '../../core/models/message';
import { StatusService } from '../../core/services/user/status.service';

@Component({
    selector: 'reg-completation',
    moduleId: module.id,
    templateUrl: 'completation.component.html',
    styleUrls: ['completation.component.css']

})
export class CompletationComponent implements OnChanges, OnInit {
    @Input() user: User = new User();

    addressData;
    addressForm = true;



    panel: number;

    isSpecialist = false;
    countries = null;
    states = null;
    multipleLicensedStates = [];
    cities = null;
    specialities = null;
    error = null;

    filteredCountries: Observable<string[]>;
    filteredStates: Observable<string[]>;
    filteredCities: Observable<string[]>;
    filteredSpeciality: Observable<string[]>;

    secretQuestions = null;

    phonePattern = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

    public mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    npiPattern = /^[0-9-A-Za-z]+$/;

    completebutton = 'none';
    backbutton;
    nextbutton;
    SelCountvalchange = '';
    SelStatevalchange = '';
    patternname = /^[A-Za-z,' ']+$/;
    Loadingpage = 'none';
    completionpage = 'block';
    emaildisable = true;
    Mnumber;

    credentials = [
        { value: 'M.D.' },
        { value: 'D.O.' },
        { value: 'R.N.' },
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

    form;

    constructor(private _auth: AuthService,
        private _geo: GeoLocationService,
        private _statusService: StatusService,
        private _specialist: SpecialistService,
        private _questionsService: SecureQuestionsService,
        private _router: Router, private _uiServices: UIService) { }

    addressOnDataReceived(data) {

        this.addressForm = data.isFormValid;
        this.user.address = data.values.address;
        this.user.address1 = data.values.address1;
        this.user.cityName = data.values.cityName;
        this.user.countryName = data.values.countryName;
        this.user.stateId = data.values.stateId;
        this.user.zipCode = data.values.zipCode;
    }

    public noWhitespaceValidator(control: FormControl) {
        const isWhitespace = (control.value || '').trim().length !== (control.value || '').length;
        const isValid = !isWhitespace;
        return isValid ? null : { 'whitespace': true };
    }

    secretQuestionMatcher = (control: AbstractControl): { [key: string]: boolean } => {

        const question1 = control.get('secretQuestion1');
        const question2 = control.get('secretQuestion2');

        if (!question1 || !question2) { return null; }
        return question1.value !== question2.value ? null : { sameQuestions: true };
    }

    secretAnswerMatcher = (control: AbstractControl): { [key: string]: boolean } => {
        const answer1 = control.get('secretAnswer1');
        const answer2 = control.get('secretAnswer2');


        if (!answer1 || !answer2) { return null; }
        return answer1.value !== answer2.value ? null : { sameAnswers: true };

    }

    formgroupquestionmatcher() {

        this.form = new FormGroup({
            'credentials': new FormControl(this.user.credentials, []),
            'lastName': new FormControl(this.user.lastName, []),
            'firstName': new FormControl(this.user.firstName, []),
            'email': new FormControl(this.user.email, []),
            'title': new FormControl(this.user.title, []),
            'mobileNumber': new FormControl(this.user.mobileNumber, []),
            'employer': new FormControl(this.user.employer, []),
            // 'address': new FormControl(this.user.address, []),
            // 'addressOptional': new FormControl(this.user.address1, []),
            // 'city': new FormControl(this.user.city, []),
            // 'state': new FormControl(this.user.state, []),
            // 'zipCode': new FormControl(this.user.zipCode, []),
            // 'country': new FormControl(this.user.country, []),
            'terms': new FormControl(this.user.terms, []),
            'deaNumber': new FormControl(this.user.specialist.deaNumber, []),
            'npiNumber': new FormControl(this.user.specialist.npiNumber, []),
            'speciality': new FormControl(this.user.specialist.speciality, []),
            'physicianLicenseNumber': new FormControl(this.user.specialist.physicianLicenseNumber, []),
            'licensedStates': new FormControl(this.user.specialist.licensedStates, []),
            'practiceGroup': new FormControl(this.user.specialist.practiceGroup, []),
            'secretQuestion1': new FormControl(this.user.secretQuestion1, []),
            'secretQuestion2': new FormControl(this.user.secretQuestion2, []),
            'secretAnswer1': new FormControl(this.user.secretAnswer1, []),
            'secretAnswer2': new FormControl(this.user.secretAnswer2, [])
        },
            Validators.compose([this.secretQuestionMatcher, this.secretAnswerMatcher])
        );
        // this.secretQuestionMatcher
    }
    formgroup() {

        this.form = new FormGroup({
            'credentials': new FormControl(this.user.credentials, []),
            'lastName': new FormControl(this.user.lastName, []),
            'firstName': new FormControl(this.user.firstName, []),
            'email': new FormControl(this.user.email, []),
            'title': new FormControl(this.user.title, []),
            'mobileNumber': new FormControl(this.user.mobileNumber, []),
            'employer': new FormControl(this.user.employer, []),
            // 'address': new FormControl(this.user.address, []),
            // 'addressOptional': new FormControl(this.user.address1, []),
            // 'city': new FormControl(this.user.city, []),
            // 'state': new FormControl(this.user.state, []),
            // 'zipCode': new FormControl(this.user.zipCode, []),
            // 'country': new FormControl(this.user.country, []),
            'terms': new FormControl(this.user.terms, []),
            'deaNumber': new FormControl(this.user.specialist.deaNumber, []),
            'npiNumber': new FormControl(this.user.specialist.npiNumber, []),
            'speciality': new FormControl(this.user.specialist.speciality, []),
            'physicianLicenseNumber': new FormControl(this.user.specialist.physicianLicenseNumber, []),
            'licensedStates': new FormControl(this.user.specialist.licensedStates, []),
            'practiceGroup': new FormControl(this.user.specialist.practiceGroup, []),
            'secretQuestion1': new FormControl(this.user.secretQuestion1, []),
            'secretQuestion2': new FormControl(this.user.secretQuestion2, []),
            'secretAnswer1': new FormControl(this.user.secretAnswer1, []),
            'secretAnswer2': new FormControl(this.user.secretAnswer2, [])
        },
        );
    }
    panelvalidation() {
        if (this.panel == 1) {
            this.addressForm = true;
            this.formgroup();
            this.form.controls['credentials'].setValidators([Validators.required]);
            this.form.controls['lastName'].setValidators([
                Validators.required,
                this.noWhitespaceValidator,
                Validators.pattern(this.patternname)
            ]);
            this.form.controls['firstName'].setValidators([
                Validators.required,
                this.noWhitespaceValidator,
                Validators.pattern(this.patternname)
            ]);
            this.form.controls['email'].setValidators([Validators.required, Validators.email]);
            this.form.controls['title'].setValidators([Validators.required]);
            this.form.controls['mobileNumber'].setValidators([Validators.required]);

            this.form.updateValueAndValidity();
        } else if (this.panel == 2) {
            this.formgroup();
            this.form.controls['employer'].setValidators([Validators.required, this.noWhitespaceValidator]);
            this.form.updateValueAndValidity();
        } else if (this.panel == 3) {
            this.addressForm = true;
            this.formgroupquestionmatcher();
            this._questionsService.getSecretQuestions().subscribe(
                (response) => this.secretQuestions = JSON.parse(response._body),
                (error) => { }
            );
            this.form.controls['secretQuestion1'].setValidators([Validators.required]);
            this.form.controls['secretQuestion2'].setValidators([Validators.required]);
            this.form.controls['secretAnswer1'].setValidators([
                Validators.required,
                Validators.minLength(5),
                Validators.maxLength(20),
                this.noWhitespaceValidator
            ]);
            this.form.controls['secretAnswer2'].setValidators([
                Validators.required,
                Validators.minLength(5),
                Validators.maxLength(20),
                this.noWhitespaceValidator
            ]);

            this.form.updateValueAndValidity();

        } else if (this.panel == 4) {
            this.addressForm = true;
            this.formgroup();
            this._geo.getStates(this.user.countryId.toString()).subscribe(
                (response) => {
                    this.states = JSON.parse(response._body);
                    this.filteredStates = this.form.controls.state.valueChanges
                        .startWith(null)
                        .map(val => val ? this.filterStates(val) : this.states.slice());

                },
                (error) => { }
            );
            this._specialist.getSpeciality().subscribe(
                (response) => {
                    this.specialities = JSON.parse(response._body);
                    this.filteredSpeciality = this.form.controls.speciality.valueChanges
                        .startWith(null)
                        .map(val => val ? this.filterSpecialist(val) : this.specialities.slice());
                },
                (error) => { }
            );
            this.form.controls['deaNumber'].setValidators([Validators.required, this.noWhitespaceValidator]);
            this.form.controls['npiNumber'].setValidators([Validators.pattern(this.npiPattern), Validators.required]);
            this.form.controls['speciality'].setValidators([Validators.required]);
            // this.form.controls['physicianLicenseNumber'].setValidators([Validators.required, this.noWhitespaceValidator]);
            this.form.controls['licensedStates'].setValidators([Validators.required]);
            this.form.controls['practiceGroup'].setValidators([Validators.required, this.noWhitespaceValidator]);
            this.form.updateValueAndValidity();
        }
    }
    buttonshow() {
        if (this.panel == 1) {
            this.nextbutton = 'block';
            this.backbutton = 'none';
            this.completebutton = 'none';
        } else if (this.panel == 2) {
            this.nextbutton = 'block';
            this.backbutton = 'block';
            this.completebutton = 'none';
        } else if (this.panel == 3) {
            if (this.isSpecialist) {
                this.nextbutton = 'block';
                this.backbutton = 'block';
                this.completebutton = 'none';
            } else {
                this.nextbutton = 'none';
                this.backbutton = 'block';
                this.completebutton = 'block';
            }

        } else if (this.panel == 4) {
            this.nextbutton = 'none';
            this.backbutton = 'block';
            this.completebutton = 'block';
        }
    }
    next() {
        const body = {
            values: this.user,
            css: 'col-md-6',
        };

        this.addressData = body;

        if (this.panel < 4) {
            this.panel++;
            this.panelvalidation();
            this.buttonshow();
        } else {

        }
    }
    previous() {

        const body = {
            values: this.user,
            css: 'col-md-6',
        };

        this.addressData = body;

        if (this.panel > 1) {
            this.panel--;
            this.panelvalidation();
            this.buttonshow();
        } else {

        }

    }
    openedChange(opened: boolean) {

        if (!opened) {
            for (let index = 0; index < this.user.specialist.licensedStates.length; index++) {
                if (!this.user.specialist.licensedStates[index].licenceNumber) {
                    this.form.controls['licensedStates'].setErrors({ 'required': true });
                }
            }
        } else {
            this.form.controls['licensedStates'].setErrors(null);
        }

    }

    zipCodeCheck(val) {

        this.user.stateId = '';
        this.user.stateName = '';
        this.user.cityName = '';
        this.user.cityId = '';

        if (val && !isNaN(val)) {
            if (val.trim().length == 5) {

                this._geo.getStateCityWithZipCode(val).subscribe(
                    (response) => {
                        const res = response.json();

                        this.user.stateId = res.stateId;
                        this.user.stateName = res.stateName;
                        this.user.cityName = res.cityName;
                        this.user.cityId = res.cityId;

                        this.form.controls['zipCode'].setErrors(null);

                    },
                    (error) => {
                        this.form.controls['zipCode'].setErrors({ 'incorrect': true });


                    }
                );
            }
        }

    }
    register() {
        this.Loadingpage = 'block';
        this.completionpage = 'none';

        // let number= this.Mnumber;
        // let formatenumber = number.replace(/[- )(]/g,'');
        // this.user.mobileNumber = '+1'+formatenumber;

        if (this.user.specialist.licensedStates) {
            const temp = this.user.specialist.licensedStates;
            for (let index = 0; index < temp.length; index++) {
                this.user.specialist.licensedStates[index].stateId = temp[index].id;
                this.user.specialist.licensedStates[index].id = 0;
            }
        }

        this.user.email = this.user.email.toLocaleLowerCase();

        this._auth.update(this.user).subscribe(
            (response: Response) => {
                if (response.status == 200) {


                    this._statusService.getStatus().subscribe(
                        (response) => {
                            this.user = JSON.parse(response._body);
                            this._statusService.setUserInfo(this.user);
                            this.user = JSON.parse(response._body);

                            this._router.navigate(['']);
                            this._auth.loginStatusChanged.next(true);

                        },
                        (error) => {

                        });


                    // this._auth.loginStatusChanged.next(true);
                    // this._router.navigate(['/home']);
                }
            }, (error: Response) => {
                const msg = new Message();
                msg.msg = 'Sorry an error has occurred. Please try again.'
                // msg.title=""
                // msg.iconType=""
                this._uiServices.showToast(msg);
                this.Loadingpage = 'none';
                this.completionpage = 'block';
                (error) => this.error = error._body;
            }


        );
    }

    ngOnChanges() {
        const specialist = new Specialist();
        this.user = this.user;
        this.user.specialist = specialist;
    }

    ngOnInit() {
        const body = {
            values: null,
            css: 'col-md-6',
        };
        //testr
        this.addressData = body;
        // this.Mnumber=(this.user.mobileNumber).substr(2);
        this.panel = 2;
        this.formgroup();
        this.panelvalidation();

        this.user.countryName = 'United States';
        this.user.countryId = 1;
        this.getStatesByCountry(1);
    }

    toggleIsSpecialist() {
        this.isSpecialist = !this.isSpecialist;
        this.form.controls['deaNumber'].reset('');
        this.user.specialist.deaNumber = undefined;

        this.form.controls['npiNumber'].reset('');
        this.user.specialist.npiNumber = undefined;

        this.form.controls['speciality'].reset('');
        this.user.specialist.speciality = undefined;

        this.form.controls['physicianLicenseNumber'].reset('');
        this.user.specialist.physicianLicenseNumber = undefined;

        this.form.controls['licensedStates'].reset('');
        this.user.specialist.licensedStates = undefined;

        this.form.controls['practiceGroup'].reset('');
        this.user.specialist.practiceGroup = undefined;

        this.buttonshow();
    }

    getState(event: MatOptionSelectionChange, country) {
        // this.filteredStates=null;
        // this.states=null;
        if (event.source.selected) {
            this._geo.getStates(country.id).subscribe(
                (response) => {
                    this.states = JSON.parse(response._body);
                    this.filteredStates = this.form.controls.state.valueChanges
                        .startWith(null)
                        .map(val => val ? this.filterStates(val) : this.states.slice());

                },
                (error) => { }
            );
        }
    }

    getCities(event: MatOptionSelectionChange, state) {
        // this.filteredCities=null;
        // this.cities=null;
        if (event.source.selected) {
            this._geo.getCities(state.id).subscribe(
                (response) => {
                    this.cities = response.json();
                    this.filteredCities = this.form.controls.city.valueChanges
                        .startWith(null)
                        .map(val => val ? this.filterCities(val) : this.cities.slice());
                },
                (error) => this.error = error._body
            );
        }
    }

    filterCountries(val: string): string[] {
        if (val.constructor == Object) {
            return this.countries;
        }
        return this.countries.filter(option =>
            option.countryName.toLowerCase().indexOf(val.toLowerCase()) === 0);
    }

    filterCities(val: string): string[] {
        if (val.constructor == Object) {
            return this.cities;
        }
        return this.cities.filter(option =>
            option.cityName.toLowerCase().indexOf(val.toLowerCase()) === 0);
    }

    filterStates(val: string): string[] {
        if (val.constructor == Object) {
            return this.states;
        }
        return this.states.filter(option =>
            option.stateName.toLowerCase().indexOf(val.toLowerCase()) === 0);
    }

    filterSpecialist(val: string): string[] {
        if (val.constructor == Object) {
            return this.specialities;
        }
        return this.specialities.filter(option =>
            option.name.toLowerCase().indexOf(val.toLowerCase()) === 0);
    }

    displayCountry(country): string {
        return country ? country.countryName : '';
    }
    displayState(state): string {
        return state ? state.stateName : '';
    }
    displayCity(city): string {
        return city ? city.cityName : '';
    }
    displaySpeciality(speciality): string {
        return speciality ? speciality.name : '';
    }

    focusoutSelectSpeciality() {
        const temp = this.user.specialist.speciality || {};
        if (temp.constructor == Object) {
            return;
        }
        const value = this.user.specialist.speciality;
        const filters = this.specialities.filter(f => f.name.toLowerCase() == value.toLowerCase());
        if (filters.length == 0) {
            this.form.controls.speciality.reset('');
            this.user.specialist.speciality = undefined;
            this.form.controls.speciality.setErrors({ 'required': true });
            return;
        }
        this.form.controls.speciality.setValue(filters[0]);
    }



    focusinSelectCountries(val) {

        if (this.SelCountvalchange != val && this.SelCountvalchange != '') {
            this.form.controls.city.reset('');
            this.form.controls.state.reset('');
        }
        if (val != '') {
            this.form.controls.state.enable();
        }

    }
    focusoutSelectCountries(val) {
        const temp = this.user.country || {};

        this.SelCountvalchange = val;
        if (val == '') {
            // this.form.controls.state.disable();
            // this.form.controls.city.disable();
        } else {

            this.form.controls.state.enable();

        }
        if (temp.constructor == Object) {
            return;
        }
        const name = this.user.country;
        const filters = this.countries.filter(f => f.countryName.toLowerCase() == name.toLowerCase());

        if (filters.length == 0) {
            this.form.controls.country.reset('');
            this.form.controls.state.reset('');
            this.form.controls.city.reset('');
            this.form.controls.country.setErrors({ 'required': true });
            // this.form.controls.state.disable();
            // this.form.controls.city.disable();
            return;
        }


        const state = this.form.controls['state'].value || filters[0].id;
        if (state.countryId != filters[0].id) {
            this.form.controls.state.reset('');
            this.form.controls.city.reset('');
        }



        this.form.controls.country.setValue(filters[0]);
        //  this.getState(this.form.controls.state, filters[0])
    }

    focusinSelectState(val) {

        if (this.SelStatevalchange != val && this.SelStatevalchange != '') {


            this.form.controls.city.reset('');


        }

        if (val != '') {
            this.form.controls.city.enable();
        }
    }
    focusoutSelectState(val) {
        const temp = this.user.state || {};
        this.SelStatevalchange = val;
        if (val == '') {
            // this.form.controls.city.disable();
        }
        if (temp.constructor == Object) {
            return;
        }

        const name = this.user.state;
        const filters = this.states.filter(f => f.stateName.toLowerCase() == name.toLowerCase());
        if (filters.length == 0) {
            this.form.controls.state.reset('');
            this.form.controls.city.reset('');
            // this.form.controls.city.disable();
            this.user.state = undefined;
            this.user.city = undefined;
            this.form.controls.state.setErrors({ 'required': true });
            return;
        }
        const city = this.form.controls['city'].value || filters[0];
        if (city.stateId != filters[0].id) {
            this.form.controls.city.reset('');

            this.user.city = undefined;
        }
        this.form.controls.state.setValue(filters[0]);
        this.getCities(this.form.controls.city, filters[0]);
    }




    //new geo implementation

    // cities = null;
    // state = null;
    // country = null;
    displayAllCity(city): string {
        return city ? city.cityName : '';
    }
    // displayStatebycity(state): string {
    //     return state ? state.stateName : '';
    // }
    getallcities() {
        this._geo.getCitiesAll().subscribe(
            (response) => {
                this.cities = response.json();

                this.filteredCities = this.form.controls.city.valueChanges
                    .startWith(null)
                    .map(val => val ? this.filterAllCities(val) : this.cities.slice());
            },
            (error) => { }
        );
    }


    onCitySelect(event: MatOptionSelectionChange, val) {
        if (val && event.source.selected) {

            this.getStatesByCity(val.id);
        }

    }


    getStatesByCity(val) {
        if (val) {
            this._geo.getStatesByCity(val).subscribe(
                (response) => {
                    this.states = response.json();
                    this.user.state = this.states.stateName;
                    this.user.stateId = this.states.id;
                    this.getCountryByState(this.states.id);
                },
                (error) => { }
            );
        }

    }

    //  multipleLicensedStatescontrol = new FormControl();

    getStatesByCountry(val) {
        if (val) {
            this._geo.getStates(val).subscribe(
                (response) => {
                    this.multipleLicensedStates = response.json();
                },
                (error) => { }
            );
        }

    }

    getCountryByState(val) {
        this._geo.getCountryByState(val).subscribe(
            (response) => {
                this.countries = response.json();
                this.user.country = this.countries.countryName;
                this.user.countryId = this.countries.id;
                this.getStatesByCountry(this.user.countryId);
            },
            (error) => { }
        );
    }

    filterAllCities(val: string): string[] {
        if (val.constructor == Object) {
            return this.cities;
        }
        return this.cities.filter(option =>
            option.cityName.toLowerCase().indexOf(val.toLowerCase()) === 0);
    }

    focusoutSelectCity() {
        const temp = this.user.city || {};

        if (temp.constructor == Object) {
            return;
        }

        const name = this.user.city;
        const filters = this.cities.filter(f => f.cityName.toLowerCase() == name.toLowerCase());
        if (filters.length == 0) {
            this.form.controls.city.reset('');
            this.user.state = null;
            this.user.country = null;
            this.form.controls.city.setErrors({ 'required': true });
            return;
        }
        this.form.controls.city.setValue(filters[0]);
    }

}
