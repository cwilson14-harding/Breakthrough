import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleSetupComponent } from './single-setup.component';

describe('SingleSetupComponent', () => {
  let component: SingleSetupComponent;
  let fixture: ComponentFixture<SingleSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
