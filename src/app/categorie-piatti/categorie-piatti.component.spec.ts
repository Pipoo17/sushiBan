import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriePiattiComponent } from './categorie-piatti.component';

describe('CategoriePiattiComponent', () => {
  let component: CategoriePiattiComponent;
  let fixture: ComponentFixture<CategoriePiattiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategoriePiattiComponent]
    });
    fixture = TestBed.createComponent(CategoriePiattiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
