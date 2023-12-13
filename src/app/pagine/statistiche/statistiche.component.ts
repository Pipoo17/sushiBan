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
  classificaOrdiniPerUtente: any;
  tabellaclassificaOrdiniPerUtente: any;

  constructor(
    public servizioMenu: MenuService, 
    private supabaseService: SupabaseService,
  ) {
    this.supabaseService.checkAuth();
    this.initDatiTabella();

    // Inizializza il grafico a torta classificaOrdiniPerUtente 

        this.options = {
            title: {
                display: true,
                text: 'My Title',
                fontSize: 16
            },
            legend: {
                position: 'bottom'
            },
            scale: {
              gridLines: {
                display: false,
              }
            }
        };
        
    this.initGraficoTorta();

  }

  private async initGraficoTorta() {
    let JsonclassificaOrdiniPerUtente: any[] = await this.supabaseService.getUserMostActive();

    const labels = JsonclassificaOrdiniPerUtente.map(item => item.username);
    const data = JsonclassificaOrdiniPerUtente.map(item => item.numeroordini);

    this.classificaOrdiniPerUtente = {
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


  private async initDatiTabella() {
    this.tabellaclassificaOrdiniPerUtente = await this.supabaseService.getUserMostActive();
  }




}
