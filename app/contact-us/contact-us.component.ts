import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HeaderComponent } from '../Components/header/header.component';
import { BpClientAppService } from '../BpClientApp/bpClientApp.service';

@Component({
  selector: 'bp-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})

export class ContactUsComponent implements OnInit {
  objectKeys = Object.keys;
  statechosen = false;
  statebuttontext = 'Select My State';
  chosenstatename = 'Please select your state'; // temporary data
  changestatetext = 'Select your state below to get contact information';
  stateListOn = false;
  
  onStateUnderline = false;
  offStateUnderline = true;
  stateSelectBorderOn = 'state-select-box content col-xxs-10 col-xxs-offset-1';
  stateSelectBorderOff = 'state-select-box-no-border content col-xxs-10 col-xxs-offset-1';
  
  stateSelectBoxClass = this.stateSelectBorderOn;
  chosenstate: Object;
  
  constructor(private _http: HttpClient,
    private appService: BpClientAppService,
) { }

  ngOnInit() {
    this.appService.SetPageTitle("Contact Anthem");

  }

  getStates(selectedstatename, filename) {
    this._http.get('assets/state-data/' + filename + '.json').subscribe((data) => {
      this.chosenstate = data;
      console.log(this.chosenstate);
      this.onStateSelected (selectedstatename);
    });
  }

  onClickForStates() {
    this.stateListOn = true;
  }

  onStateSelected (selectedstatename) {
    this.chosenstatename = selectedstatename;
    this.statebuttontext = 'Change State';
    this.statechosen = true;
    this.onStateUnderline = true;
    this.offStateUnderline = false;
    this.changestatetext = 'Different states have different contact information. If youre not looking for information for '
      + this.chosenstatename
      + ', change you state below';
    this.stateSelectBoxClass = this.stateSelectBorderOff;

    console.log(this.chosenstatename);
    this.closeModal();
    return this.chosenstatename;
  }

  closeModal() {
    this.stateListOn = false;
  }



}
