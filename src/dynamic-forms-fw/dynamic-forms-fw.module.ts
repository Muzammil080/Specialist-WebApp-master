import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ElementRegistry } from './services/element-registry';
import { InputFieldComponent } from './components/input-field/input-field.component';
import { UiContainerComponent } from './components/ui-container/ui-container.component';
import { UiElementComponent } from './components/ui-element/ui-element.component';
import { SectionComponent } from './components/section/section.component';
import { BrowserModule } from '@angular/platform-browser';
import { TextFieldComponent } from './components/text-field/text-field.component';
import { TextareaFieldComponent } from './components/textarea-field/textarea-field.component';
import { CheckboxFieldComponent } from './components/checkbox-field/checkbox-field.component';
import { RadiobuttonFieldComponent } from './components/radiobutton-field/radiobutton-field.component';
import { DropdownFieldComponent } from './components/dropdown-field/dropdown-field.component';
import { YesNoRadioFieldComponent } from './components/yesno-radio-field/yesnoradio-field.component';
import { MaterialModule } from '../app/material/material.module';
import { LabelComponent } from './components/label/label.component';
import { SectionModalComponent } from './components/sectionModal/sectionModal.component';

@NgModule({
    declarations: [
        InputFieldComponent,
        UiContainerComponent,
        UiElementComponent,
        SectionComponent,
        TextFieldComponent,
        TextareaFieldComponent,
        CheckboxFieldComponent,
        RadiobuttonFieldComponent,
        DropdownFieldComponent,
        YesNoRadioFieldComponent,
        LabelComponent,
        SectionModalComponent
    ],
    imports: [BrowserModule, ReactiveFormsModule, MaterialModule],
    exports: [SectionComponent, SectionModalComponent],
    providers: [ElementRegistry],
    entryComponents: [
        UiContainerComponent,
        InputFieldComponent,
        TextFieldComponent,
        TextareaFieldComponent,
        CheckboxFieldComponent,
        RadiobuttonFieldComponent,
        DropdownFieldComponent,
        YesNoRadioFieldComponent,
        LabelComponent,
        SectionModalComponent
    ]
})
export class DynamicFormsModule {}
