import { BaseModel } from './base.model';

export class TwilioChannelModel extends BaseModel {
    entityName: string;
    sid: string;
    friendlyName: string;
    lastConsumedMessageIndex: number;
    unconsumedMessagesCount: number;
}