import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ErrorLogging } from '../model/errorlogmodel';
import { Subscription } from 'rxjs/Subscription';
import { errorLoggingList } from '../data/errorlogdata';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { JsonpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Input, Output, OnChanges, EventEmitter } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
@Component({
  selector: 'app-dialog',
  template: `<div  *ngIf="visible" class="dialog">
  <ng-content></ng-content>
  <button *ngIf="closable" (click)="close()" aria-label="Close" class="dialog__close-btn">X</button>
</div>
<div *ngIf="visible" class="overlay" (click)="close()"></div>`,
  styleUrls: ['errorlogdetails.component.scss'],
  animations: [
    trigger('dialog', [
      transition('void => *', [
        style({ transform: 'scale3d(.3, .3, .3)' }),
        animate(100)
      ]),
      transition('* => void', [
        animate(100, style({ transform: 'scale3d(.0, .0, .0)' }))
      ])
    ])
  ]

})

export class ErrorDetailComponent {
  @Input() closable = true;
  @Input() visible: boolean;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() { }

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }
}
