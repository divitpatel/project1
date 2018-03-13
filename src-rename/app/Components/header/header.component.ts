import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  menuLoaded = false;
  profileLoaded=false;
  @Input() features;
  @Output() handleClickUrl = new EventEmitter<any>()
  constructor() { }

  ngOnInit() {
  }
profileMenu(){
  this.profileLoaded=  !this.profileLoaded;
}
  toggleMenu(url){
    this.menuLoaded = !this.menuLoaded;
    if(this.menuLoaded){
    document.body.classList.add('ant-menu-visible');
    }
    else
    document.body.classList.remove('ant-menu-visible')
    this.handleClickUrl.emit(url);
  }

}
