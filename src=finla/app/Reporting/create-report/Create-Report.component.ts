import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  styleUrls: ['./Create-Report.component.css'],
  selector: 'create-report',
  templateUrl: './Create-Report.component.html'
})
export class CreateReportComponent {
  private selectedReport;
  @ViewChild('myForm') private myForm: NgForm;
  @Output() handleCreateReport: EventEmitter<any> = new EventEmitter();
  content = {
    dropDown: {
      title: 'Create a New Report',
      options: [
        {
          label: 'Renewals',
          value: 'Renewals'
        },
        {
          label: 'Clients',
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
}
