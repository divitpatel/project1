import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {


  /** Defines the content to display in HTML title element, typically shown
   * in the browser's tab bar. */
  @Input()
  set title(title: string){
    this._title = title;
    this._titleService.setTitle(this._title);
  }
  get title() { return this._title; }
  private _title: string;

  constructor(private _titleService: Title) {
    /* Set the HTML title attribute for the application */
    if (!this.title) {
      this.title = 'Anthem Broker Portal - Reimaged'; // Default title value
    }
  }

  ngOnInit() {}

}
