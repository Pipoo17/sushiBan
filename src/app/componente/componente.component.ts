import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-componente',
  templateUrl: './componente.component.html',
  styleUrls: ['./componente.component.css']
})
export class ComponenteComponent implements OnInit {
  @Input() searchValue: string = '';
  title = 'NomeBase';
  isDisabled = false;
  immagine = 'https://www.costacrociere.it/content/dam/costa/costa-magazine/photo/hub-photo/lisbon/foto-lisbona.jpg.image.750.563.low.jpg';
  i = '';
  menu = [
    { codice: "A1", nome: "nome A1", counter: 0 },
    { codice: "B2", nome: "nome B2", counter: 0 },
    { codice: "C3", nome: "nome C3", counter: 0 },
    { codice: "D4", nome: "nome D4", counter: 0 },
  ];
  filteredMenu: any[] = [];

  ngOnInit(): void {
    this.filteredMenu = this.menu; // Inizialmente mostra l'intero menu
  }

  onInput(event: any) {
    this.title = event.target.value;
    console.log(event.target.value);
  }

  onClick() {
    this.title = 'click';
  }

  clickimg1() {
    this.immagine = 'https://www.costacrociere.it/content/dam/costa/costa-magazine/photo/hub-photo/lisbon/foto-lisbona.jpg.image.750.563.low.jpg';
  }

  clickimg2() {
    this.immagine = 'https://static2.iodonna.it/wp-content/uploads/2015/04/mammiferir842_M2_640.jpg?v=2334';
  }

  aggiungiPiatto(i: number) {
    console.log("searchvalue : "+this.searchValue);
    if (this.menu[i].counter < 5)
      this.menu[i].counter += 1;
  }

  rimuoviPiatto(i: number) {
    console.log("searchvalue : "+this.searchValue);
    if (this.menu[i].counter > 0)
      this.menu[i].counter -= 1;
  }

  resetTitle() {
    this.title = 'NomeProva';
  }

  filterMenuByCode(searchValue: string) {
    if (searchValue === '') {
      this.filteredMenu = this.menu; // Nessuna ricerca, mostra l'intero menu
    } else {
      this.filteredMenu = this.menu.filter(piatto => piatto.codice === searchValue);
    }
  }
  
  

  aggiornaRicerca() {
    this.filterMenuByCode(this.searchValue);
  }
}
