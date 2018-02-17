import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiSetupComponent } from './multi-setup.component';

describe('MultiSetupComponent', () => {
  let component: MultiSetupComponent;
  let fixture: ComponentFixture<MultiSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
