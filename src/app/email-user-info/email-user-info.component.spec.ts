import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailUserInfoComponent } from './email-user-info.component';

describe('EmailUserInfoComponent', () => {
  let component: EmailUserInfoComponent;
  let fixture: ComponentFixture<EmailUserInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailUserInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailUserInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
