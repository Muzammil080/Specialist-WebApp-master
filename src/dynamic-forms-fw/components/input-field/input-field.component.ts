import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { IUIElement } from '../../interfaces/i-ui-element';
import { SectionElement } from '../../models/section-element';

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.css']
})
export class InputFieldComponent implements IUIElement, OnInit {

  private _form : FormGroup;
  private _uiElementData : SectionElement;

  
  @Input()
  set form(frm : FormGroup) {
    this._form = frm;
    
  }
  @Input()
  set uiElementData(element : SectionElement){
    this._uiElementData = element;

  }
  get form() : FormGroup {
   
    return this._form;
  }
  get uiElementData() : SectionElement{
    return this._uiElementData;
  }
  
  constructor() { }

  ngOnInit() {
  }

  getTemplateName(){
    return "textinput";
  }

}
