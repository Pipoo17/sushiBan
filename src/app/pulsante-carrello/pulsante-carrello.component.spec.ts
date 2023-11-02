import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PulsanteCarrelloComponent } from './pulsante-carrello.component';

describe('PulsanteCarrelloComponent', () => {
  let component: PulsanteCarrelloComponent;
  let fixture: ComponentFixture<PulsanteCarrelloComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PulsanteCarrelloComponent]
    });
    fixture = TestBed.createComponent(PulsanteCarrelloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
