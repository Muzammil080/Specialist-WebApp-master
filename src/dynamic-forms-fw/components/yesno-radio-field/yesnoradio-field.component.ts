import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { SectionElement } from '../../models/section-element';
import { IUIElement } from '../../interfaces/i-ui-element';
import { Parameter } from '../../models/parameter';

@Component({
  selector: 'yesnoradio-field',
  templateUrl: './yesnoradio-field.component.html',
  styleUrls: ['./yesnoradio-field.component.css']
})
export class YesNoRadioFieldComponent implements IUIElement, OnInit {

  private _element: SectionElement;

  @Input()
  options: Array<Parameter>;
  @Input()
  form: FormGroup;
  @Input()
  set uiElementData(element: SectionElement) {
    this._element = element;
    //get properties, if required
    //get attributes, if required
    //apply attributes, if required
    //get options from properties 
    this.options = this.getOptions();
  }
  get uiElementData(): SectionElement {
    return this._element;
  }

  constructor() { }

  ngOnInit() {
  }

  getOptions(): Parameter[] {
    let options = new Array<Parameter>();
    if (this._element.parameters) {
      this._element.parameters.forEach(p => {
        if (p.type === "Option")
          options.push(p);
      })
    }
    return options;
  }

}
