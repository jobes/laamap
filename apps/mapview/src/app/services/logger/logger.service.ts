/* eslint-disable no-console */
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  logErrorMsg(source: string, msg: string): void {
    console.error(source, msg);
  }
}
