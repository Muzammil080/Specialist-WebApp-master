import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { SectionElement } from '../../models/section-element';
import { ISection } from '../../interfaces/i-section';
import { Section } from '../../models/section';
import { ClinicalNotesService } from '../../../app/core/services/clinical-notes/clinical.notes.service';

@Component({
    selector: "form-section",
    templateUrl: './section.component.html',
    styleUrls: ['./section.component.css']
})
export class SectionComponent implements ISection, OnInit {
    private _section: Section;
    form: FormGroup = new FormGroup({});
    containers: SectionElement[];
    formChangesSubscription;
    @Output() onDataReceived = new EventEmitter<any>();
    @Input()
    set sectionData(section: Section) {
        console.log('Section sectionData');

        this._section = section;

        console.log(this._section);

        if (!this._section) { return; }

        // Get section details from server
        this._noteService
            .getSectionElements(this._section.id)
            .subscribe(res => {
                this._section.elements = JSON.parse(res._body);
                if (!this._section.elements) { return; }
                // Get root containers
                this.containers = this.getRootContainers();
                // Generate a form group

                this.form = this.createFormGroup(this.containers);
                this._section.form = this.form;

                // Form vahnges detection
                if (this._section.name === 'NIH Stroke Scale') {
                    this.formChangesSubscription = this.form.valueChanges.subscribe(
                        values => {
                            console.log(values);
                            let totalScore = 0;

                            for (const key in values) {
                                const val = values[key] + '';
                                if (val && val.split('(').length > 1) {
                                    totalScore += +val.split('(')[
                                        val.split('(').length - 1
                                    ][0];
                                }
                            }

                            if (values['totalScore'] !== ': ' + totalScore) {
                                this.form.controls['totalScore'].patchValue(
                                    ': ' + totalScore
                                );
                            }
                        }
                    );
                } else {
                    if (this.formChangesSubscription) {
                        this.formChangesSubscription.unsubscribe();
                    }
                }
                // Get form values from server
                this._noteService
                    .getSectionValues(
                        this._section.specialistRequestId,
                        this._section.id,
                        this._section.specialityId,
                        this._section.workflowInstanceId,
                    )
                    .subscribe(res => {
                        const values = JSON.parse(res._body);

                        // update form controls with values
                        this.onDataReceived.emit(false);
                        let totalScore = 0;
                        values.forEach(val => {
                            if (this.form.controls[val.key]) {
                                if (this._section.name === 'NIH Stroke Scale') {
                                    console.log(this._section.name);
                                    console.log(val.key);

                                    if (val.key === 'totalScore') {
                                        console.log(val.key);
                                        val.value =
                                            ': ' + totalScore.toString();
                                    }

                                    if (
                                        val.value.split('(').length > 1 &&
                                        !isNaN(
                                            val.value.split('(')[
                                            val.value.split('(').length - 1
                                            ][0]
                                        )
                                    ) {
                                        totalScore += +val.value.split('(')[
                                            val.value.split('(').length - 1
                                        ][0];
                                    }
                                }
                                if (val.value === 'false') {
                                    this.form.controls[val.key].patchValue(
                                        false
                                    );
                                } else {
                                    this.form.controls[val.key].patchValue(
                                        val.value
                                    );
                                }
                            }
                        });
                    });
                // this.form.patchValue()
            });
    }

    get sectionTitle(): string {
        if (!this._section) { return ''; } else { return this._section.name; }
    }

    constructor(private _noteService: ClinicalNotesService) { }

    ngOnInit() {
        console.log('Section ngOnInit');
        //   this._noteService.behaviorSubjectUiElement.subscribe(val => {
        //     console.log("behaviorSubjectUiElement subscribe 2");
        //     // if (val.split("(").length > 1 && !isNaN(val.split("(")[val.split("(").length - 1][0])) {
        //     //   i += +val.split("(")[val.split("(").length - 1][0];
        //     // }
        //     this.form.controls['totalScore'].patchValue(50);

        // });
        // this.form.valueChanges.subscribe((values) => {
        //   console.log("this.form.valueChanges.subscribe: " + values)
        //   let i: number = 0;
        //   values.forEach(val => {
        //     if (this.form.controls[val.key]) {
        //       if (this._section.name == "NIH Stroke Scale") {
        //         console.log(this._section.name);
        //         console.log(val.key);

        //         if (val.key == 'totalScore') {
        //           console.log(val.key);
        //           val.value = i.toString();
        //         }

        //         if (val.value.split("(").length > 1 && !isNaN(val.value.split("(")[val.value.split("(").length - 1][0])) {
        //           i += +val.value.split("(")[val.value.split("(").length - 1][0];
        //         }

        //       }
        //       if (val.value === 'false')
        //         this.form.controls[val.key].patchValue(false);
        //       else
        //         this.form.controls[val.key].patchValue(val.value);
        //     }
        //   })
        // });
    }

    getRootContainers(): SectionElement[] {
        const elements = [];

        this._section.elements.forEach(e => {
            if (e.parentElementId === 0) {
                elements.push(e);
                // populate child elements
                this.populateChildElements(e);
            }
        });

        return elements;
    }

    populateChildElements(element: SectionElement) {
        element.childElements = [];
        this._section.elements.forEach(e => {
            if (e.parentElementId === element.id) {
                element.childElements.push(e);
                this.populateChildElements(e);
            }
        });
    }

    elementIdTracker(idx: number, element: SectionElement) {
        return element.name;
    }

    createFormGroup(elements: SectionElement[]) {
        const group: any = {};

        elements.forEach(e => {
            if (e.isInputField) { group[e.bindTo] = new FormControl(''); } else if (e.childElements) { this.getFormFields(e, group); }
        });

        return new FormGroup(group);
    }

    getFormFields(element: SectionElement, group: any) {
        element.childElements.forEach(e => {
            if (e.isInputField) { group[e.bindTo] = new FormControl(''); } else if (e.childElements) { this.getFormFields(e, group); }
        });
    }

    formSubmit() { }
}
