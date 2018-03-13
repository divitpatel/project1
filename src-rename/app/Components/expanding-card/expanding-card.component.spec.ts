import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandingCardComponent } from './expanding-card.component';

describe('ExpandingCardComponent', () => {
  let component: ExpandingCardComponent;
  let fixture: ComponentFixture<ExpandingCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpandingCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpandingCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
