import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'tags-container',
  templateUrl: './tags-container.component.html',
  styleUrls: ['./tags-container.component.css']
})
export class TagsContainerComponent implements OnInit {
  @Input() tags;
  @Output() closeTag: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  onClose(tagValue) {
    this.closeTag.emit(tagValue);
  }

  checkIfArray() {
    return Array.isArray(this.tags);
  }

}
