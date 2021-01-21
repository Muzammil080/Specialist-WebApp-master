import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SectionElement } from '../../models/section-element';
import { IUIElement } from '../../interfaces/i-ui-element';
import { Input } from '@angular/core';

@Component({
  selector: 'app-textarea-field',
  templateUrl: './textarea-field.component.html',
  styleUrls: ['./textarea-field.component.css']
})
export class TextareaFieldComponent implements IUIElement, OnInit {

  private _element : SectionElement;
  
  @Input()
  form: FormGroup;
  @Input()
  set uiElementData(element : SectionElement){
    this._element = element;
    //get properties, if required
    //get attributes, if required
    //apply attributes, if required
  }
  get uiElementData() : SectionElement {
    return this._element;
  }
  
  constructor() { }

  ngOnInit() {
  }

}
