import { Injectable } from '@angular/core';
import { CalendarEventModel } from '../../models/calander.model';
import { User } from '../../models/user';
import { Specialist } from '../../models/specialist.model';
import { Appointment } from '../../models/appointment';
import { Accepted } from '../specialist/specialistrequests.service';
import { TwilioChannelModel } from '../../models/twilioChannel.model';
import { SurveyQuestion } from '../../models/survey.question.model';
import { PatientTriage } from '../../models/patientTriage';

@Injectable()
export class MappingService {
    constructor() { }

    mapCalnderEvent(res: any): CalendarEventModel {
        const eventData = res ? res : null;
        const isCalendarEvent = new CalendarEventModel('day');
        if (eventData) {
            isCalendarEvent.end = new Date(eventData.endTime + 'Z') || null;
            isCalendarEvent.id = eventData.id || null;
            isCalendarEvent.start = new Date(eventData.startTime + 'Z') || null;
            isCalendarEvent.day = eventData.day || null;
            isCalendarEvent.draggable = false;
            isCalendarEvent.title = '';
            isCalendarEvent.startTime.hours = isCalendarEvent.start.getHours();
            isCalendarEvent.startTime.minutes = isCalendarEvent.start.getMinutes();
            isCalendarEvent.endTime.hours = isCalendarEvent.end.getHours();
            isCalendarEvent.endTime.minutes = isCalendarEvent.end.getMinutes();
            isCalendarEvent.isDeleted = eventData.isDeleted;
        }
        return isCalendarEvent;
    }

    mapUser(res: any): User {
        const userData = res ? res : null;
        const isUser = new User();
        if (userData) {
            isUser.address = userData.address || '';
            isUser.address1 = userData.address1 || '';
            isUser.cityName = userData.cityName || '';
            isUser.countryId = userData.countryId || '';
            isUser.countryName = userData.countryName || '';
            isUser.createdBy = userData.createdBy || '';
            isUser.createdOn = userData.createdOn || '';
            isUser.credentials = userData.credentials || '';
            isUser.email = userData.email || '';
            isUser.employer = userData.employer || '';
            isUser.firstName = userData.firstName || '';
            isUser.id = userData.id || 0;
            isUser.isActive = userData.isActive || true;
            isUser.lastName = userData.lastName || '';
            isUser.mobileNumber = userData.mobileNumber || '';
            isUser.secretAnswer1 = userData.secretAnswer1 || '';
            isUser.secretAnswer2 = userData.secretAnswer2 || '';
            isUser.secretQuestion1 = userData.secretQuestion1 || '';
            isUser.secretQuestion2 = userData.secretQuestion2 || '';
            isUser.stateId = userData.stateId || '';
            isUser.stateName = userData.stateName || '';
            isUser.utcDSTOffset = userData.utcDSTOffsetInSeconds || 0;
            isUser.title = userData.title || '';
            isUser.updatedOn = userData.updatedOn || '';
            isUser.userGUID = userData.userGUID || '';
            isUser.zipCode = userData.zipCode || '';

            isUser.isSpecialist = userData.isSpecialist || false;
            if (isUser.isSpecialist) {
                isUser.specialist = new Specialist();
                isUser.specialist.isActive = userData.isActive;
                isUser.specialist.timeZoneDescription =
                    userData.timeZoneDescription;
            }
        }
        return isUser;
    }

    mapAppointment(res: any): any {
        const appointmentData = res ? res : null;
        const isAppointment = new Appointment();
        if (appointmentData) {
            isAppointment.currentStateName =
                appointmentData.currentStateName || '';
            isAppointment.dob = new Date(appointmentData.dob + 'Z') || null;
            isAppointment.endDate = appointmentData.endDate ?  new Date(appointmentData.endDate + 'Z') : null;
            isAppointment.facilityId = appointmentData.facilityId || null;
            isAppointment.id = appointmentData.id || 0;
            isAppointment.endpointId = appointmentData.endpointId || 0;
            isAppointment.workflowInstanceId =
                appointmentData.workflowInstanceId || 0;
            isAppointment.mrn = appointmentData.mrn || '';
            isAppointment.patientFirstName =
                appointmentData.patientFirstName || '';
            isAppointment.patientId = appointmentData.patientId || null;
            isAppointment.patientLastName =
                appointmentData.patientLastName || '';
            isAppointment.roomNumber = appointmentData.roomNumber || '';
            isAppointment.sessionId = appointmentData.sessionId || null;
            isAppointment.sex = appointmentData.sex || '';
            isAppointment.specialistFirstName =
                appointmentData.specialistFirstName || '';
            isAppointment.specialistId = appointmentData.specialistId || null;
            isAppointment.specialistLastName =
                appointmentData.specialistLastName || '';
            isAppointment.specialityName = appointmentData.specialityName || '';
            isAppointment.startDate = appointmentData.startDate ? new Date(appointmentData.startDate + 'Z') : null;
            isAppointment.type = appointmentData.type || '';
            isAppointment.visitType = appointmentData.visitType;
            isAppointment.initials = appointmentData.initials;
            if (appointmentData.insurance) {
                isAppointment.patientTriage = this.mappatientTriage(appointmentData.patientTriage);
            }
        }
        return isAppointment;
    }

    mappatientTriage(patientTriage: any): PatientTriage {
        const patientTriageData = patientTriage ? patientTriage : null;
        const ispatientTriage = new PatientTriage();
        if (patientTriageData) {
            ispatientTriage.allergies = patientTriageData.allergies || '';
            ispatientTriage.appointmentId = patientTriageData.appointmentId || 0;
            ispatientTriage.bottomBloodPressure = patientTriageData.bottomBloodPressure || 0;
            ispatientTriage.comments = patientTriageData.comments || '';
            ispatientTriage.currentMedications = patientTriageData.currentMedications || '';
            ispatientTriage.habits = patientTriageData.habits || '';
            ispatientTriage.heartRate = patientTriageData.heartRate || 0;
            ispatientTriage.history = patientTriageData.history || '';
            ispatientTriage.id = patientTriageData.id || 0;
            ispatientTriage.temperature = patientTriageData.temperature || 0;
            ispatientTriage.topBloodPressure = patientTriageData.topBloodPressure || 0;
        }
        return ispatientTriage;
    }

    mapAcceptedRequest(res: any): Accepted {
        const acceptedRequestData = res ? res : null;
        const isAccepted = new Accepted();
        if (acceptedRequestData) {
            isAccepted.facilityName = acceptedRequestData.facilityName || '';
            isAccepted.host = acceptedRequestData.host || null;
            isAccepted.id = acceptedRequestData.sessionId || null;
            isAccepted.platform = acceptedRequestData.platform || null;
            isAccepted.resourceId = acceptedRequestData.resourceId || 0;
            isAccepted.serialNumber = acceptedRequestData.serialNumber || '';
            isAccepted.token = acceptedRequestData.token || null;
        }
        return isAccepted;
    }

    mapTwilioChannel(res: any): TwilioChannelModel {
        const twilioChannelModelData = res ? res : null;
        const isTwilioChannelModel = new TwilioChannelModel();
        if (twilioChannelModelData) {
            isTwilioChannelModel.id = twilioChannelModelData.id || 0;
            isTwilioChannelModel.entityName =
                twilioChannelModelData.entityName || null;
            isTwilioChannelModel.lastConsumedMessageIndex =
                twilioChannelModelData.lastConsumedMessageIndex || 0;
            isTwilioChannelModel.sid = twilioChannelModelData.sid || 0;
            isTwilioChannelModel.unconsumedMessagesCount = 0;
            isTwilioChannelModel.friendlyName =
                twilioChannelModelData.friendlyName || null;
            isTwilioChannelModel.updatedOn =
                twilioChannelModelData.state.dateUpdated;
        }
        return isTwilioChannelModel;
    }

    mapSurveyQuestion(res: any): SurveyQuestion {
        const questionData = res ? res : null;
        const questionModel = new SurveyQuestion();
        if (questionData) {
            questionModel.id = questionData.id || 0;
            questionModel.code = questionData.code || '';
            questionModel.question = questionData.question || '';
            questionModel.surveyId = questionData.surveyId || 0;
            questionModel.answere = '';
        }
        return questionModel;
    }
}
