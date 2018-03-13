import { Component, OnInit } from '@angular/core';

import { Message, MessageType } from './message';
import { MessagingService } from './messagingService';

@Component({
  selector: 'msg-cmp',
  templateUrl: './messaging.component.html',
})

export class MessagingComponent implements OnInit {
  message: Message[] = [];

  constructor(private msgService: MessagingService) { }

  ngOnInit() {
    this.msgService.getMsg().subscribe((msg: Message) => {
      if (!msg) {
        this.message = [];
        return;
      }
      this.message.push(msg);
    });
  }

  removeMsg(msg: Message) {
    this.message = this.message.filter(x => x !== msg);
  }

  cssClass(msg: Message) {
    if (!msg) {
      return;
    }
    // return css class based on alert type
    switch (msg.type) {
      case MessageType.Success:
        return 'alert alert-success';
      case MessageType.Error:
        return 'alert alert-danger';
      case MessageType.Info:
        return 'alert alert-info';
      case MessageType.Warning:
        return 'alert alert-warning';
    }
  }
}
