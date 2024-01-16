import { Component } from '@angular/core';
import { CarrelloComponent } from '../../pagine/carrello/carrello.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-pulsante-carrello',
  templateUrl: './pulsante-carrello.component.html',
  styleUrls: ['./pulsante-carrello.component.css']
})
export class PulsanteCarrelloComponent {
  constructor(private dialog:MatDialog) {}

  openCart() {
    this.dialog.open(CarrelloComponent);
    // data : {menu: this.menu}
  }

  closeCart() {
    this.dialog.closeAll;
  }
}
