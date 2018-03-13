import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { Message, MessageType } from './message';

@Injectable()
export class MessagingService {
  private subject = new Subject<Message>();

  constructor() {
    this.clear();
  }

  getMsg(): Observable<any> {
    return this.subject.asObservable();
  }

  success(message: string) {
    this.msg(MessageType.Success, message);
  }

  error(message: string) {
    this.clear();
    this.msg(MessageType.Error, message);
  }

  info(message: string) {
    this.msg(MessageType.Info, message);
  }

  warn(message: string) {
    this.msg(MessageType.Warning, message);
  }

  msg(type: MessageType, message: string) {
    this.subject.next(<Message>{ type, message });
  }

  clear() {
    this.subject.next();
  }
}
