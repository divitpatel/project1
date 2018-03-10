import { Component, NgModule } from '@angular/core';
import { ErrorLogging} from '../logging/models/errorLoggingModel';
import {EmpFileterComponent} from "./filters/emp-filter.component"
import {errorLoggingList} from '../logging/data/errorLoggingData';
@Component({
	selector: 'my-pagination',
	templateUrl: './errorLogging.component.html',
	styles: ['.pagination { margin: 0px !important; }']
	
})
export class ErrorLoggingComponent {
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

	constructor( ){
		console.log(errorLoggingList);
			this.filteredItems = errorLoggingList;
		  this.init();
	};
	init(){
			this.currentIndex = 1;
			this.pageStart = 1;
			this.pages = 4;

			this.pageNumber = parseInt(""+ (this.filteredItems.length / this.pageSize));
			if(this.filteredItems.length % this.pageSize != 0){
				this.pageNumber ++;
			}
	 
			if(this.pageNumber  < this.pages){
					this.pages =  this.pageNumber;
			}
		 
			this.refreshItems();
			console.log("this.pageNumber :  "+this.pageNumber);
	}

	FilterByName(){
		this.filteredItems = [];
		if(this.inputName != ""){
            errorLoggingList.forEach(element => {
 					if(element.firstName.toUpperCase().indexOf(this.inputName.toUpperCase())>=0){
						this.filteredItems.push(element);
					}
				});
		}else{
			this.filteredItems = errorLoggingList;
		}
		console.log(this.filteredItems);
		this.init();
	}
	fillArray(): any{
		var obj = new Array();
		for(var index = this.pageStart; index< this.pageStart + this.pages; index ++) {
						obj.push(index);
		}
		return obj;
	}
  refreshItems(){
					this.items = this.filteredItems.slice((this.currentIndex - 1)*this.pageSize, (this.currentIndex) * this.pageSize);
					this.pagesIndex =  this.fillArray();
	}
	prevPage(){
		if(this.currentIndex>1){
			this.currentIndex --;
		} 
		if(this.currentIndex < this.pageStart){
			this.pageStart = this.currentIndex;
		}
		this.refreshItems();
	}
	nextPage(){
		if(this.currentIndex < this.pageNumber){
				this.currentIndex ++;
		}
		if(this.currentIndex >= (this.pageStart + this.pages)){
			this.pageStart = this.currentIndex - this.pages + 1;
		}
 
		this.refreshItems();
	}
 	setPage(index : number){
		 debugger;
		 console.log(index);
	 		this.currentIndex = index;
	 		this.refreshItems();
 	}

 }
