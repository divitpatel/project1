import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'list-view-header',
  templateUrl: './list-view-header.component.html',
  styleUrls: ['./list-view-header.component.css']
})
export class ListViewHeaderComponent implements OnInit {
  @Input() title;

  constructor() { }

  ngOnInit() {
  }


}
