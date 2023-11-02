import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfiloComponent } from './profilo.component';

describe('ProfiloComponent', () => {
  let component: ProfiloComponent;
  let fixture: ComponentFixture<ProfiloComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfiloComponent]
    });
    fixture = TestBed.createComponent(ProfiloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
