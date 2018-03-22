import { Component, ViewChild, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ButtonDropDownComponent } from '@anthem/uxd';

@Component({
  selector: 'create-report',
  styleUrls: ['./Create-Report.component.css'],
  templateUrl: './Create-Report.component.html',
  encapsulation: ViewEncapsulation.None
})
export class CreateReportComponent {
  private selectedReport;
  @ViewChild('myForm') private myForm: NgForm;
  @Output() handleCreateReport: EventEmitter<any> = new EventEmitter();

  @ViewChild('reportTypeDropdown')
  private _reportTypeDropdown: ButtonDropDownComponent;

  get reportType(): string { return this._reportType; }
  set reportType(type: string) { this._reportType = type;}
  private _reportType: string;

  content = {
    dropDown: {
      label: 'Select a Report Type',
      options: [
        {
          title: 'Renewals',
          value: 'Renewals'
        },
        {
          title: 'Clients',
          value: 'Clients'
        }
      ]
    },
    dropDown2: {
      title: "Report Schedule",
      options: [
        {
          label: "One Time Only",
          value: "oneTime"
        },
        {
          label: "Monthly",
          value: "monthly"
        }
      ]
    }
  }

  constructor(private _route: ActivatedRoute) { }

  createReport() {
    const encryptedTaxId = this._route.snapshot.params['taxId']
    const temp = this.myForm.form.value;

    const reportObj = {
      reportType: this.selectedReport,
      title: temp.title,
      description: temp.description,
      reportCriteria: {
        agentTin: encryptedTaxId
      },
      createdBy: encryptedTaxId
    }
    this.handleCreateReport.emit(reportObj);

    setTimeout(() => {
      this.myForm.reset();
    }, 2000)
  }

  cancelReport() {
    this.myForm.reset();
    this.selectedReport = undefined;
  }

  public _onReportTypeSelect(newReportType: string){
    console.log(newReportType);
    this.reportType = newReportType;
    this._updateDropdownLabel(this._reportType);
  }

  private _updateDropdownLabel(newLabel: string){
    this._reportTypeDropdown.dropdown.label = newLabel;
  }
}
