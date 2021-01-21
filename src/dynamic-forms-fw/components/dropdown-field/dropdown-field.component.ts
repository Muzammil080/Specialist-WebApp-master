import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { SectionElement } from '../../models/section-element';
import { Parameter } from '../../models/parameter';

@Component({
  selector: 'app-dropdown-field',
  templateUrl: './dropdown-field.component.html',
  styleUrls: ['./dropdown-field.component.css']
})
export class DropdownFieldComponent implements OnInit {

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
