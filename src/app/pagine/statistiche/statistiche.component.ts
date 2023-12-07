import { Component } from '@angular/core';
import { MenuService } from 'src/app/servizi/menu.service';
import { SupabaseService } from 'src/app/servizi/supabase.service';



@Component({
  selector: 'app-statistiche',
  templateUrl: './statistiche.component.html',
  styleUrls: ['./statistiche.component.css']
})
export class StatisticheComponent {

  constructor(
    public servizioMenu: MenuService, 
    private supabaseService: SupabaseService,
  )
  {
    this.supabaseService.checkAuth();
  }
  basicData:any

  ngOnInit(){
    this.basicData ={
      labels : ['q1','q2','q3'],
      datasets: [{
          label: 'Nome grafico',
          data: [12,22,233],
          borderWidth: 1
        }
      ]
    }
  }
}
