import { Component } from '@angular/core';
import { MenuService } from 'src/app/servizi/menu.service';
import { SupabaseService } from 'src/app/servizi/supabase.service';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-statistiche',
  templateUrl: './statistiche.component.html',
  styleUrls: ['./statistiche.component.css']
})
export class StatisticheComponent {
  options: any;
  graficoclassificaOrdiniPerUtente: any;
  tabellaclassificaOrdiniPerUtente: any;

  graficoPiattiPiuOrdinati : any;
  tabellaPiattiPiuOrdinati : any;

  constructor(
    public servizioMenu: MenuService, 
    private supabaseService: SupabaseService,
  ) {
    this.supabaseService.checkAuth();
   
    // Classifica e tabella numero piatti per ogni utente
    this.initDatiTabellaOrdiniPerUtente();
    this.initGraficoTortaOrdiniPerUtente();

    // Classifica e tabella piatti piu ordinati
  
    this.initDatiTabellaPiattiPiuOrdinati();
    this.initGraficoPiattiPiuOrdinati()
  }

// metodi PiattiPiuOrdinati
  private async initDatiTabellaPiattiPiuOrdinati(){
    console.log(await this.supabaseService.getMostOrderedDishes());
    this.tabellaPiattiPiuOrdinati = await this.supabaseService.getMostOrderedDishes();

  }
  private async initGraficoPiattiPiuOrdinati() {
    let JsonclassificaPiattiPiuOrdinati: any[] = await this.supabaseService.getMostOrderedDishes();

    const labels = JsonclassificaPiattiPiuOrdinati.map(item => item.id);
    const data = JsonclassificaPiattiPiuOrdinati.map(item => item.numeroordinazioni);

    this.graficoPiattiPiuOrdinati = {
      labels: labels,
      datasets: [{
        label: 'Numero Ordini',
        data: data,
        backgroundColor: [
          "#ffd700",
          "#c0c0c0",
          "#cd7f32",
          "#26C6DA",
          "#7E57C2"
        ],
        borderWidth: 1
      }]
    };
  }

  // metodi OrdiniPerUtente
  private async initGraficoTortaOrdiniPerUtente() {
    let JsonclassificaOrdiniPerUtente: any[] = await this.supabaseService.getUserMostActive();

    const labels = JsonclassificaOrdiniPerUtente.map(item => item.username);
    const data = JsonclassificaOrdiniPerUtente.map(item => item.numeroordini);

    this.graficoclassificaOrdiniPerUtente = {
      labels: labels,
      datasets: [{
        label: 'Numero Ordini',
        data: data,
        backgroundColor: [
          "#ffd700",
          "#c0c0c0",
          "#cd7f32",
          "#26C6DA",
          "#7E57C2"
        ],
        borderWidth: 1
      }]
    };
  }


  private async initDatiTabellaOrdiniPerUtente() {
    this.tabellaclassificaOrdiniPerUtente = await this.supabaseService.getUserMostActive();
  }




}
