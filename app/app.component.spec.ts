import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { Component, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { AppComponent } from './app.component';


// Create a stub component for router-outlet
@Component({ selector: 'router-outlet', template: '' })
class RouterLinkStubComponent {}



describe('AppComponent', () => {
  let titleServiceStub: Partial<Title>;
  let titleService;
  let fixture: ComponentFixture<AppComponent>;
  let app: any;

  beforeEach(async(() => {
    /** Mock the Title service */
    titleServiceStub = {
      getTitle() { return this._title; },
      setTitle(newTitle: string) { this._title = newTitle; },
    };

    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        RouterLinkStubComponent,
      ],
      providers: [{ provide: Title, useValue: titleServiceStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.debugElement.componentInstance;

    // The actual Title service injected from the root injector.
    titleService = TestBed.get(Title);
  }));

  it('Should create the app component', async(() => {
    expect(app).toBeTruthy();
  }));

  it('Stubbed service and injected Title service should NOT be the same', () => {
    expect(titleServiceStub === titleService).toBe(false);

    // Confirm that changes in the mock service are not reflected in the real service
    titleServiceStub.setTitle('title');
    expect(titleService.getTitle()).not.toBe('title');
  });

  it('Should have a defined, default title attribute', async(() => {
    /** Because the title is variable, and may change, we don't initialy
     * want to compare to an exact value. Instead, make sure it exists first. */
    expect(app.title).toBeDefined();
  }));

  it(`Should have a title that can be set to 'test'`, async(() => {
    app.title = 'test';
    expect(app.title).toEqual('test'); // Check the 'title' property
    expect(titleService.getTitle()).toEqual('test'); // Check what is ultimately passed to the Title service
  }));
});
