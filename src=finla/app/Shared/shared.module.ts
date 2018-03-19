import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ColumnWithHeadingComponent } from '../Components/column-with-heading/column-with-heading.component';
import { ExpandingCardComponent } from '../Components/expanding-card/expanding-card.component';
// import { ListViewHeaderComponent } from '../Components/list-view-header/list-view-header.component';
// import { TagsContainerComponent } from '../Components/tags-container/tags-container.component';
import { FooterComponent } from '../Components/footer/footer.component';
import { HeaderComponent } from '../Components/header/header.component';
import { UserProfileComponent } from '../Components/user-profile/user-profile.component';
import { ConfirmpopupComponent } from '../Components/confirmpopup/confirmpopup.component';
import { DropDownComponent } from '../Components/drop-down/drop-down.component';
import { SimpleTabsComponent } from '../Components/simple-tabs/simple-tabs.component';
import { TwoColumnLinksListComponent } from '../Components/two-column-links-list/two-column-links.component'

import { MenuComponent } from '../Components/menu/menu.component';
import { MessagingComponent } from './messaging/messaging.component';
import { MessagingService } from './messaging/messagingService';
import { SafeMarkupDirective } from './Directives/safeMarkup.directive';

import { WindowUtils } from './Providers/NativeWindow.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    ColumnWithHeadingComponent,
    ExpandingCardComponent,
    // ListViewHeaderComponent,
    // TagsContainerComponent,
    FooterComponent,
    HeaderComponent,
    UserProfileComponent,
    ConfirmpopupComponent,
    DropDownComponent,
    MenuComponent,
    MessagingComponent,
    SimpleTabsComponent,
    TwoColumnLinksListComponent
  ],
  providers: [
    MessagingService,
    WindowUtils
  ],
  exports: [
    ColumnWithHeadingComponent,
    ExpandingCardComponent,
    HeaderComponent,
    UserProfileComponent,
    ConfirmpopupComponent,
    DropDownComponent,
    MenuComponent,
    FooterComponent,
    MessagingComponent,
    SimpleTabsComponent,
    TwoColumnLinksListComponent
  ],
})
export class BpSharedModule { }
