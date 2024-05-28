import { Component } from '@angular/core';
import { MenuService } from 'src/app/servizi/menu.service';
import { SupabaseService } from 'src/app/servizi/supabase.service';



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

  displayedColumnsClassificaUtenti: string[] = ['avatar', 'username', 'numeroordini'];
  displayedColumnsClassificaPiatti: string[] = ['immagine', 'id', 'descrizione', 'numeroordinazioni'];

  //Modificando questo valore cambia il numero di righe mostrate nelle classifiche e dentro i grafici
  maxRowClassifica : number = 5;

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

  private async initDatiTabellaOrdiniPerUtente() {    
    const temp = await this.supabaseService.getUserMostActive();
    this.tabellaclassificaOrdiniPerUtente = temp.slice(0, this.maxRowClassifica);
    
  }

  private async initDatiTabellaPiattiPiuOrdinati(){
    const temp = await await this.supabaseService.getMostOrderedDishes();
    this.tabellaPiattiPiuOrdinati = temp.slice(0, this.maxRowClassifica);
    
  }
  private async initGraficoPiattiPiuOrdinati() {

    let temp: any[] = await this.supabaseService.getMostOrderedDishes();
    let JsonclassificaPiattiPiuOrdinati = temp.slice(0, this.maxRowClassifica);

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
    let temp: any[] = await this.supabaseService.getUserMostActive();
    let JsonclassificaOrdiniPerUtente = temp.slice(0, this.maxRowClassifica);


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


  getImages(bucket : string, nomeImmagine : string){
    return this.supabaseService.getPictureURL(bucket,nomeImmagine)
    }






  }



