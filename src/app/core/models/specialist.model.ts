import { BaseModel } from './base.model';

export class Specialist extends BaseModel {
    speciality: string;
    specialityId: string;
    deaNumber: string;
    npiNumber: string;
    physicianLicenseNumber: string;
    licensedStates: any[];
    practiceGroup: string;
    timeZoneDescription: string;
    specialityName: string;
}
