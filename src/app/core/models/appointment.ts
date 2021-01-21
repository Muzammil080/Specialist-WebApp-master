import { PatientTriage } from './patientTriage';

export class Appointment {
    currentStateName: string;
    dob: Date;
    endDate: Date;
    facilityId: number;
    id: number;
    mrn: string;
    patientFirstName: string;
    patientId: number;
    patientLastName: string;
    roomNumber: string;
    sessionId: number;
    sex: string;
    specialistFirstName: string;
    specialistId: number;
    specialistLastName: string;
    specialityName: string;
    startDate: Date;
    type: string;
    workflowInstanceId: number;
    endpointId: number;
    visitType: string;
    initials: string;
    patientTriage: PatientTriage;
}

export class RequestedAppointment {
    id: number;
    type: string;
    sessionId: number;
    specialistId: 0;
    facilityId: 0;
    startDate: Date;
    endDate: Date;
    patientId: number;
    mrn: string;
    patientLastName: string;
    patientFirstName: string;
    sex: string;
    dob: Date;
    specialistFirstName: string;
    specialistLastName: string;
    specialityName: string;
    roomNumber: string;
    currentStateName: string;
    workflowInstanceId: number;
    endpointId: number;
    visitType: string;
    initials: string;
    patientTriage: PatientTriage;
}
