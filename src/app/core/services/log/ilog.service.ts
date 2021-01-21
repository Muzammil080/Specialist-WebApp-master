import { LogMessage } from "../../models/log.message";

/**
 * Log Service Interface
 */
export interface ILogService {
    log(msg : LogMessage);
    logAction(action: string, tag: string);
    logError(error: string, tag:string);
}
/**
 * End of Interface
 */