import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardPiattoComponent } from './card-piatto.component';

describe('CardPiattoComponent', () => {
  let component: CardPiattoComponent;
  let fixture: ComponentFixture<CardPiattoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardPiattoComponent]
    });
    fixture = TestBed.createComponent(CardPiattoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
