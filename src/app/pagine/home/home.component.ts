import { Component, Input, OnInit } from '@angular/core';
import { MenuService } from 'src/app/servizi/menu.service';
import { SupabaseService } from 'src/app/servizi/supabase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  //providers:[MenuService]
})
export class HomeComponent implements OnInit {
  @Input() searchValue: string = '';
  title = 'NomeBase';
  isDisabled = false;
  immagine = 'https://www.costacrociere.it/content/dam/costa/costa-magazine/photo/hub-photo/lisbon/foto-lisbona.jpg.image.750.563.low.jpg';
  i = '';
  
  filteredMenu: any[] = [];

  constructor(
    public servizioMenu: MenuService, 
    private supabaseService: SupabaseService,
    private router: Router,
    )
  {

    this.supabaseService.checkIfUserAuth();
    this.supabaseService.setUserLogged(true)

  }




  ngOnInit(): void {
    //console.log(this.servizioMenu.getCategorie())
    this.servizioMenu.menu$.subscribe((menu) => {
      this.filteredMenu = menu;
    });
  }


 getImmagineUrlFromName(codicePiatto: string){
    this.supabaseService.getImmagineUrlFromName("immaginiPiatti", codicePiatto)
}

aggiungiPiatto(i: number) {
  this.servizioMenu.aggiungiPiatto(i);
}

rimuoviPiatto(i: number) {
  this.servizioMenu.rimuoviPiatto(i);
}

filterMenuByCode(searchValue: string) { 
    if (searchValue === '') {
      this.filteredMenu = this.servizioMenu.menu; // Nessuna ricerca, mostra l'intero menu
  } else {
      this.filteredMenu = this.servizioMenu.menu.filter(piatto => piatto.codice === searchValue);
  }
}


  
}
