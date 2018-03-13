import { Component, NgModule,ChangeDetectorRef } from '@angular/core';
import { ErrorLogging} from '../model/errorlogmodel';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

import {errorLoggingList} from '../data/errorlogdata';
import {ErrorDetailComponent} from '../errorlog_details/errorlogdetails.component';
import { debug } from 'util';
import {
	TableColumn,
	ColumnMode
  } from '@swimlane/ngx-datatable';

// @Component({
// 	selector: 'client-paging-demo',
// 	template: `
// 	  <div>
// 		<h3>
// 		 XYZ
// 		</h3>
// 		<ngx-datatable
// 		  class="material"
// 		  [rows]="errorLoggingList"
// 		  [columns]="[{name:'userName'},{name:'firstName'}]"
// 		  [columnMode]="'force'"
// 		  [headerHeight]="50"
// 		  [footerHeight]="50"
// 		  [rowHeight]="'auto'"
// 		  [limit]="10">
// 		</ngx-datatable>

// 	  </div>
// 	`
//   })
@Component({
	selector: 'my-pagination',
	 templateUrl: './errorloglist.component.html',
	
	styles: ['.pagination { margin: 0px !important; }']

})
export class ErrorLoggingComponent {
	showDialog = false;
		rows = [

	  ];
	  columns = [
		{ prop: 'id' },
		{ name: 'userName' },
		{ name: 'firstName' },
		{ name: 'email' },
		{ name: 'phoneNumber' },
		{ name: 'location' },
		{ name: 'ipAddress' },
		{ name: 'errorLog' },
		{ name: 'date' },

	  ];
	  temp = [];
	listFileter : string;
	filteredItems : ErrorLogging[];
	pages : number = 10;
    pageSize : number = 5;
	pageNumber : number = 0;
	currentIndex : number = 1;
	items: ErrorLogging[];
	pagesIndex : Array<number>;
	pageStart : number = 1;
	inputName : string = '';
	errordetails:string = '';
	constructor(private modalService:NgbModal,
		private _changeDetectorRef: ChangeDetectorRef,){
		console.log(errorLoggingList);
		this.rows = errorLoggingList;
		this.temp = errorLoggingList;
			this.filteredItems = errorLoggingList;
		 
	};

	  errorclickevent(rowdata){
		  this.errordetails =rowdata.errorLog;
          this.showDialog = true;
	  }
	 updateFilter(event) {
		const val = event.target.value.toLowerCase();
	
		// filter our data
		const temp = this.temp.filter(function(d) {
		  return d.userName.toLowerCase().indexOf(val) !== -1 || !val;
		});
	
		// update the rows
		this.rows = temp;
		// Whenever the filter changes, always go back to the first page
		
	  }
	
 }
