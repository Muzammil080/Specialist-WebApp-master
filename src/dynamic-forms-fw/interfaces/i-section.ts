import { FormGroup } from "@angular/forms";

import { Section } from "../models/section";

export interface ISection {
    sectionTitle : string;
    sectionData : Section;
    form : FormGroup
}