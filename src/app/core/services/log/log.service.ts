import { Injectable } from "@angular/core";
import { ILogService } from "./ilog.service";
import { LogMessage, LogTypes } from "../../models/log.message";

/**
 * Log Service
 */
@Injectable()
export class LogService implements ILogService {
    log(msg: LogMessage) {
  
    }
    logAction(action: string, tag: string) {
    }
    logError(error: string, tag: string) {
        console.error(error + ' ' + tag);
    }
}