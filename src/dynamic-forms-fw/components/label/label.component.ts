import { FormGroup } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { IUIElement } from '../../interfaces/i-ui-element';
import { SectionElement } from '../../models/section-element';


@Component({
  selector: 'app-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.css']
})
export class LabelComponent implements IUIElement, OnInit {

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
