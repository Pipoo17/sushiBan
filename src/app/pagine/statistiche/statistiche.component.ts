import { Component } from '@angular/core';
import { MenuService } from 'src/app/servizi/menu.service';
import { SupabaseService } from 'src/app/servizi/supabase.service';
import {ChartModule} from 'primeng/chart';

@Component({
  selector: 'app-statistiche',
  templateUrl: './statistiche.component.html',
  styleUrls: ['./statistiche.component.css']
})
export class StatisticheComponent {
  options: any;
  classificaOrdiniPerUtente: any;

  constructor(
    public servizioMenu: MenuService, 
    private supabaseService: SupabaseService,
  ) {
    this.supabaseService.checkAuth();

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
          "#42A5F5",
          "#66BB6A",
          "#FFA726",
          "#26C6DA",
          "#7E57C2"
        ],
        hoverBackgroundColor: [
          "#64B5F6",
          "#81C784",
          "#FFB74D"
      ],
        borderWidth: 1
      }]
    };
  }
}
