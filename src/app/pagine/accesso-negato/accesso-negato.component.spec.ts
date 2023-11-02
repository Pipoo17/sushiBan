import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessoNegatoComponent } from './accesso-negato.component';

describe('AccessoNegatoComponent', () => {
  let component: AccessoNegatoComponent;
  let fixture: ComponentFixture<AccessoNegatoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccessoNegatoComponent]
    });
    fixture = TestBed.createComponent(AccessoNegatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
