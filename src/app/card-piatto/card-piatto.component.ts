import { Component, Input } from '@angular/core';
import { MenuService } from '../servizi/menu.service';

@Component({
  selector: 'app-card-piatto',
  templateUrl: './card-piatto.component.html',
  styleUrls: ['./card-piatto.component.css']
})
export class CardPiattoComponent {
  @Input() piatto: any; // Passa il piatto come input
  @Input() img: any; // Passa l'URL dell'immagine come input
  @Input() i!: number; // Aggiungi l'input per l'indice

  constructor(public servizioMenu: MenuService){}

  isClicked: boolean = false;

  pulsantePreferiti(index : number) {
    this.servizioMenu.menu[index].preferito = !this.servizioMenu.menu[index].preferito
    console.log(this.servizioMenu.menu)
    this.isClicked = !this.isClicked;

  }

  aggiungiPiatto(i: number) {
    this.servizioMenu.aggiungiPiatto(i);
  }

  rimuoviPiatto(i: number) {
    this.servizioMenu.rimuoviPiatto(i);
  }
}
