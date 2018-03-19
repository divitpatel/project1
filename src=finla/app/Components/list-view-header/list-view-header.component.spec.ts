import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListViewHeaderComponent } from './list-view-header.component';

describe('ListViewHeaderComponent', () => {
  let component: ListViewHeaderComponent;
  let fixture: ComponentFixture<ListViewHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListViewHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListViewHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
