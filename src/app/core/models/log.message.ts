export enum LogTypes{
    Information,
    Warning,
    Error,
    UserAction
}

export class LogMessage {
    LogType : LogTypes;
    Message : string;
    Tag : string;
}