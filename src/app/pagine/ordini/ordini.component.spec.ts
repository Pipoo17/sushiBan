import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdiniComponent } from './ordini.component';

describe('OrdiniComponent', () => {
  let component: OrdiniComponent;
  let fixture: ComponentFixture<OrdiniComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrdiniComponent]
    });
    fixture = TestBed.createComponent(OrdiniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
