import { Component, OnInit, DoCheck, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'simple-tabs',
  templateUrl: './simple-tabs.component.html',
  styleUrls: ['./simple-tabs.component.css']
})
export class SimpleTabsComponent implements OnInit {
  @Input() activeTab;
  @Input() labels;
  @Input() colorSettings;
  @Input() breakpoint;
  @Output() tabSelected: EventEmitter<any> = new EventEmitter<any>();
  private viewportWidth;
  private viewportHeight;
  private colorConfing;
  private hoverTab =  -1;
  private showMobileButtons =  false;
  private defaultColorSettings = {
                  normal: "#009999",
                  hover: "#008888",
                  active: "#009999",
                  textColor: "#fff"
              };

  constructor() { }

  ngOnInit() {
    this.colorSettings = Object.assign({}, this.defaultColorSettings, this.colorSettings);
    this.colorConfing = {
        tabContainerStyle: {
            backgroundColor: this.colorSettings.normal,
        },
        tabButtonStyle: {
            backgroundColor: this.colorSettings.normal,
        }
    };
    this.activeTab = (this.activeTab)? parseInt(this.activeTab,10) : 0;

    this.updateDimensions();
    document.addEventListener('mousemove', this.onMouseMove)
    window.addEventListener("resize", this.updateDimensions);
    console.log('SimpleTabs this', this);
  }

  ngDoCheck(){
    this.updateDimensions();
    this.breakpoint = this.breakpoint ? parseInt(this.breakpoint,10) : 1024;
  }

  onMouseEnter(indx){
    this.hoverTab = indx;
  }

  onMouseLeave(){
    this.hoverTab = -1;
  }

  onMouseMove(e){
    if(!e.target.classList.contains("SimpleTabButton") && this.hoverTab != -1){
       this.hoverTab = -1;
      }
  }

  handleClick(indx, tabLabel){
      this.activeTab = indx;
      // if (typeof this.tabSelected === "function") {
          this.tabSelected.emit(tabLabel);
      // }else{
          // throw new Error("No tabSelected callback defined.");
      // }
  }

  handleMobileClick(indx, tabLabel){
          this.activeTab = indx;
          this.showMobileButtons = false;
      // if (typeof this.tabSelected === "function") {
          this.tabSelected.emit(tabLabel);
      // }else{
      //     throw new Error("No tabSelected callback defined.");
      // }
  }

  handleOpenMobile(){
          this.showMobileButtons = true;
  }

  handleCloseMobile(){
          this.showMobileButtons = false;
  }

  updateDimensions() {
    this.viewportWidth = window.innerWidth;
    this.viewportHeight = window.innerHeight;
  }

  ngOnDestroy(){
    try{
      window.removeEventListener("resize", this.updateDimensions);
      document.removeEventListener('mousemove', this.onMouseMove)
    }catch(err){
      console.log("UNMOUNTING ERROR:",err);
    }
  }

}
