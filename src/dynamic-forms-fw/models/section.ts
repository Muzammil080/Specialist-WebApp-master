import { SectionElement } from "./section-element";
import { FormGroup } from "@angular/forms";

export class Section {
    id: number;
    name: string;
    versionNumber: string;
    specialityId: any;
    specialistRequestId: any;
    form: FormGroup;
    workflowInstanceId: any;
    elements: SectionElement[];
}
