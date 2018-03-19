import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnWithHeadingComponent } from './column-with-heading.component';

describe('ColumnWithHeadingComponent', () => {
  let component: ColumnWithHeadingComponent;
  let fixture: ComponentFixture<ColumnWithHeadingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColumnWithHeadingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnWithHeadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
