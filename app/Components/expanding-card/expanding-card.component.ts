import {
    Component,
    OnInit,
    HostListener,
    Input,
    Output,
    EventEmitter,
} from '@angular/core';

@Component({
  selector: 'expanding-card',
  templateUrl: './expanding-card.component.html',
  styleUrls: ['./expanding-card.component.css'],
  host: {
    '(window:resize)': 'onResize($event)'
  }
})
export class ExpandingCardComponent implements OnInit {
  expanded: boolean = false;
  windowWidth: number = window.innerWidth;
  @Input() columnData;
  @Output() toggleCallback: EventEmitter<any> = new EventEmitter();
  @Output() handleColumnClick: EventEmitter<any> = new EventEmitter();
  @Input() brokerFDocID: string;
  @Input() clientID: string;

  styles = {
    container: {
        verticalAlign: "top"
    }
  };
    mainColStyle = {
    row: {
        fontSize: "18px",
        lineHeight: "26px",
        color: "#848484",
        padding: "0 15px 0 0",
        wordBreak: "break-word",
        fontWeight: "400",
    },
    heading:{
        fontSize: "14px",
        fontWeight: "600",
        color: "#848484",
    }};

  constructor() { }

  ngOnInit() {

  }

  onResize(event){
    this.windowWidth = event.target.innerWidth;
  }

  handleExpandToggle() {
    this.expanded = !this.expanded
    this.toggleCallback && this.toggleCallback.emit(this.expanded);
  }

  getColumnWidth(winWidth, colIndex, columnWidthMultipliers){
    let defaultColumnCountInFirstRow;

    if(winWidth < 600){
        defaultColumnCountInFirstRow = 1;
    }

    if (winWidth >= 600 && winWidth < 768) {
        defaultColumnCountInFirstRow = 2;
    }

    if (winWidth >= 768 && winWidth < 960) {
        defaultColumnCountInFirstRow = 3;
    }

    if (winWidth >= 960 && winWidth < 1440) {
        defaultColumnCountInFirstRow = 4;
    }

    if (winWidth >= 1440) {
        defaultColumnCountInFirstRow = 6;
    }

    return {
        width: (winWidth < 600) ? 100 : (columnWidthMultipliers[colIndex] * (100 / defaultColumnCountInFirstRow)),
        finalColumnCount: defaultColumnCountInFirstRow
    };
  }

  getColumnWidthMultipliers(obj: any){
    let widthMultipliers = [];
    for (let col in obj) {
        if(obj[col].doubleWidth ) {
            widthMultipliers.push(2);
        } else {
            widthMultipliers.push(1);
        }
    }
    return widthMultipliers;
  }

  getContainerStyle = (col, colIndex) => {
    let colWidthMultipliers = this.getColumnWidthMultipliers(this.columnData.columns);
    let containerStyles;

    let thisColumnWidthInfo = this.getColumnWidth(this.windowWidth, colIndex, colWidthMultipliers);

    let thisColumnShouldShow = (this.expanded) ? true : (thisColumnWidthInfo.finalColumnCount > colIndex);

    let colContent = col.content;

    containerStyles = {
        width: thisColumnWidthInfo.width + "%",
        display: thisColumnShouldShow? "inline-block" : "none",
    };


    return containerStyles

  }

  getContainerStyleFn = this.getContainerStyle.bind(this);


}
