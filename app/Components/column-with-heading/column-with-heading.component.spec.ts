import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ColumnWithHeadingComponent } from './column-with-heading.component';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('ColumnWithHeadingComponent', () => {
  let component: ColumnWithHeadingComponent;
  let fixture: ComponentFixture<ColumnWithHeadingComponent>;
  let itemBtnDe: DebugElement;
  
  let testData = {
    mainColumn: {
      type: "full-column",
      link: "",
      label: "",
      content: "",
    },
    columns: [
      {
        type: "block",
        link: "",
        label: "Status",
        content: "",
      },
      {
        link: "",
        type: "html",
        label: "Criteria",
        customStyles: "",
        content: ('<div class="raIconContainer">View Criteria<i  class="fa fa-angle-right" [ngStyle]="cheveronStyle"></i></div>'),
      },
      {
        type: "html",
        link: "",
        label: "Download",
        customStyles: "",
        content: ('<div class="raIconContainer">XLS</div>'),
      },
      {
        type: "html",
        link: "",
        label: "Action",
        customStyles: "",
        content: ('<div class="raIconContainer">Delete</div>'),
      },
    ]
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ColumnWithHeadingComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnWithHeadingComponent);
    component = fixture.componentInstance;
    // Added row data
    component.rows = testData.columns[2];
    itemBtnDe = fixture.debugElement.query(By.css('.cwhListItem'));
    fixture.detectChanges();
  });

  /* Test whether the component can be created. */
  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should have row data', () => {
    expect(component.rows).toBeDefined();
  });

  it('should emit event when clicked', () => {
    let event: Event;

    component.rows = testData.columns[2];
    itemBtnDe = fixture.debugElement.query(By.css('.cwhListItem'));
    fixture.detectChanges();

    component.handleColumnClick.subscribe((clickEvent: Event) => event = clickEvent);
    itemBtnDe.triggerEventHandler('click', null)
    expect(event).toBeDefined();
  });
});
