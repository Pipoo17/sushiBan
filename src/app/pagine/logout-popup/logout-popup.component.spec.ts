import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoutPopupComponent } from './logout-popup.component';

describe('LogoutPopupComponent', () => {
  let component: LogoutPopupComponent;
  let fixture: ComponentFixture<LogoutPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LogoutPopupComponent]
    });
    fixture = TestBed.createComponent(LogoutPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
