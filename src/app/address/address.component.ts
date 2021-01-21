import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core'
import { FormGroup, FormControl, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router'
import { MatOptionSelectionChange } from "@angular/material";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import { Address } from './../core/models/address';
import { GeoLocationService } from './../core/services/location/geo-location.service';

@Component({
    selector: 'address-component',
    moduleId: module.id,
    templateUrl: 'address.component.html',
    styleUrls: ['address.component.css']

})

export class AddressComponent implements OnInit {

    constructor(private _geo: GeoLocationService) { }

    @Output() onDataReceived = new EventEmitter<any>();
    @Input() data;

    isNumPattern = /^[0-9]+$/;
    namePattern = /^[A-Za-z,' ']+$/;

    states;

    cloClass
    //  = 'col-md-4';

    compareFn(p1, p2) {
        return p1 && p2 ? p1 === p2 : p1 === p2;
    }

    public noWhitespaceValidator(control: FormControl) {
        let isWhitespace = (control.value || '').trim().length !== (control.value || '').length;
        let isValid = !isWhitespace;
        return isValid ? null : { 'whitespace': true }
    }

    form = new FormGroup({

        'address': new FormControl('', [ this.noWhitespaceValidator]),
        'address1': new FormControl('', [this.noWhitespaceValidator]),
        'cityName': new FormControl('', [Validators.pattern(this.namePattern)]),
        'stateId': new FormControl('', [Validators.required]),
        'zipCode': new FormControl('', [Validators.required, Validators.pattern(this.isNumPattern), Validators.minLength(5)]),
        'countryName': new FormControl('', [Validators.required]),

    });

    ngOnInit() {

        this.cloClass = this.data.css
        this.getStates();
        this.getValues();
        this.onChanges();
    }

    getValues() {
        if (this.data.values) {
            this.form.patchValue(this.data.values);
        }

        
    }

    SendValues(values: Address) {


        this.data = values;
        this.data.countryId = 1;
      

        let data = {
            values: this.data,
            isFormValid: this.form.valid

        }

        this.onDataReceived.emit(data);
    }

    onChanges(): void {
        this.form.valueChanges.subscribe(values => {

            this.SendValues(values);


        });
    }

    getStates() {

        this._geo.getCountries().subscribe(res => {
            let countries = JSON.parse(res._body);
            this.form.controls['countryName'].setValue(countries[0].countryName);

            this._geo.getStates(countries[0].id).subscribe(res => {
                
                
                 this.states = JSON.parse(res._body);;
                
             }, err => {
     
             });
        }, err => {

        });

      
    }



}