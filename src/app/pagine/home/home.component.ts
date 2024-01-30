import { Component, Input, OnInit } from '@angular/core';
import { MenuService } from 'src/app/servizi/menu.service';
import { SupabaseService } from 'src/app/servizi/supabase.service';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/servizi/message.service';

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
  i = '';
  
  filteredMenu: any[] = [];

  constructor(
    public servizioMenu: MenuService, 
    private supabaseService: SupabaseService,
    private router: Router,
    public MessageService: MessageService,
    )
  {
    this.supabaseService.checkAuth();

  }

  




  ngOnInit(): void {
    //console.log(this.servizioMenu.getCategorie())
    this.servizioMenu.menu$.subscribe((menu) => {
      this.filteredMenu = menu;
    });
    console.log(this.filteredMenu);
    
  }



aggiungiPiatto(i: number) {
  this.servizioMenu.aggiungiPiatto(i);
}

rimuoviPiatto(i: number) {
  this.servizioMenu.rimuoviPiatto(i);
}

filterMenuByCodeOrName(searchValue: string) { 
  if (searchValue === '') {
    this.filteredMenu = this.servizioMenu.menu; // Nessuna ricerca, mostra l'intero menu
  } else {
    const searchLower = searchValue.toLowerCase();
    this.filteredMenu = this.servizioMenu.menu.filter(piatto => 
      piatto.codice.toLowerCase().includes(searchLower) || piatto.nome.toLowerCase().includes(searchLower)
    );
  }
}
//nasconde le categorie che non hanno piatti
esistonoCard(categoria: string): boolean {
  return this.servizioMenu.menu.some(piatto =>
    (piatto.categoria === categoria) && (piatto.codice.toUpperCase().includes(this.searchValue.toUpperCase()) || piatto.nome.toLowerCase().includes(this.searchValue.toLowerCase()))
  );
}
mostraCard(): boolean {
  return this.servizioMenu.menu.some(piatto =>
    (piatto.codice.toUpperCase().includes(this.searchValue.toUpperCase()) || piatto.nome.toLowerCase().includes(this.searchValue.toLowerCase()))
  );
}
}
