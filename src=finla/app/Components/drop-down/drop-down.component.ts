import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-drop-down',
  templateUrl: './drop-down.component.html',
  styleUrls: ['./drop-down.component.css']
})
export class DropDownComponent implements OnInit {
  active: boolean = false;
  selectedValue = {};
  @Input() placeholder:string = "Select an Option";
  @Output() onSelection: EventEmitter<any> = new EventEmitter();
  @Input() renderList: any;// = [{ text: "By Client", value: "byClient" }, { text: "By Market", value: "byMarket" }];
  constructor() { }

  toggleList() {
    this.active = !this.active;
  }

  selectedItem(value) {
    this.selectedValue = value;
    this.active = false;
    this.onSelection.emit(value);
  }
  ngOnInit() {
    this.selectedValue = this.renderList[0]
  }

}

