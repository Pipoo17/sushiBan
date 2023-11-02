import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticheComponent } from './statistiche.component';

describe('StatisticheComponent', () => {
  let component: StatisticheComponent;
  let fixture: ComponentFixture<StatisticheComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatisticheComponent]
    });
    fixture = TestBed.createComponent(StatisticheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
