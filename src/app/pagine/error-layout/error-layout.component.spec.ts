import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorLayoutComponent } from './error-layout.component';

describe('ErrorLayoutComponent', () => {
  let component: ErrorLayoutComponent;
  let fixture: ComponentFixture<ErrorLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ErrorLayoutComponent]
    });
    fixture = TestBed.createComponent(ErrorLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
