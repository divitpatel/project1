import { Component , OnInit, Output, Input, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit{
  @Input('features') features;
  @Output() handleClick = new EventEmitter<any>();
  navigation = [
    {
      "headTitle": "Book of Business",
      id: "bookOfBusiness",
      "menu": [
        {
          "title": "Commissions",
          "url": "/commissions",
          "disable": true,
          "dataAnalytics": "menuBobCommissionsLinkFlyout"
        },
        {
          "title": "Renewals",
          "url": "/renewals",
          "disable": true,
          "dataAnalytics": "menuBobRenewalsLinkFlyout"
        },
        {
          "title": "Billing",
          "url": "/billing",
          "disable": false,
          "dataAnalytics": "menuBobBillingsLinkFlyout"
        },
        {
          "title": "Clients",
          "url": "/clients",
          "disable": true,
          "dataAnalytics": "menuBobClientsLinkFlyout"
        },
        {
          "title": "Applications",
          "url": "/applications",
          "disable": true,
          "dataAnalytics": "menuBobApplicationsLinkFlyout"
        },
        {
          "title": "Quotes",
          "url": "/quotes",
          "disable": true,
          "dataAnalytics": "menuBobQuotesLinkFlyout",
          "hide": "hidden"
        }
      ]
    },
    {
      "headTitle": "Tools",
      id: "tools",
      "menu": [
        {
          "title": "Reports",
          "url": "/reports",
          "disable": true,
          "dataAnalytics": "menuToolsReportsLinkFlyout"
        },
        {
          "title": "Agent Connect",
          "url": "/agentConnect",
          "disable": true,
          "dataAnalytics": "menuToolsAgentConnectLinkFlyout"
        },
        {
          "title": "Find a Doctor",
          "url": "https://www.anthem.com/find-doctor/",
          "disable": false,
          "dataAnalytics": "menuToolsFindADoctorLinkFlyout"
        }
      ]
    },
    {
      "headTitle": "Support",
      id: "support",
      "menu": [
        {
          "title": "Product Sales Information",
          "url": "/content",
          "disable": true,
          "dataAnalytics": "menuSupportProductSalesInfoLinkFlyout"
        },
        {
          "title": "Terms of Use",
          "url": "https://www.anthem.com/legal/",
          "disable": false,
          "dataAnalytics": "menuSupportTermsOfUseFlyout"
        },
        {
          "title": "Message Center",
          "url": "/messageCenter",
          "disable": true,
          "hide": "hidden"
        },
        {
          "title": "Contact Anthem",
          "url": "/contactAnthem",
          "disable": true,
          "hide": "hidden"
        },
        {
          "title": "FAQ",
          "url": "/faq",
          "disable": true,
          "hide": "hidden"
        }
      ]
    }
  ];

  menuSelectedIndex = -1;

  constructor() { }
  ngOnInit(){
    let temp = this.navigation;
    Object.keys(temp).map((item, ind)=>{
      this.navigation[ind].menu.map((subItem, index)=>{
        this.navigation[ind].menu[index].disable = subItem.url.indexOf("https") !== -1 ? false :  !this.features[subItem.url.split("/")[1]];

      });
    });
  }

  onClick(ind) {
    this.menuSelectedIndex = (this.menuSelectedIndex === ind) ? -1 : ind;
  };

  navigateByUrl(url){
    this.handleClick.emit(url);
  }
}
