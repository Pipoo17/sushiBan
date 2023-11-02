import { Component } from '@angular/core';
import { MenuService } from 'src/app/servizi/menu.service';
import { SupabaseService } from 'src/app/servizi/supabase.service';

@Component({
  selector: 'app-carrello',
  templateUrl: './carrello.component.html',
  styleUrls: ['./carrello.component.css'],
  //providers:[MenuService]
})


export class CarrelloComponent {

  constructor(public servizioMenu: MenuService, private supabaseService: SupabaseService) {}

  ngOnInit():void{
    const userId = 123; // Sostituisci con l'ID utente reale o il valore necessario.
  }
  
  
  onSubmit(){ 
    let paramJson = this.servizioMenu.getOrdine()
    console.log("paramJson : ",paramJson)
    this.servizioMenu.insertOrdine(paramJson);


    //insert nel db firebase
/*
    this.servizioMenu.insertOrdine(
      this.servizioMenu.urlDBOrdini,
      this.servizioMenu.menu
    ).subscribe(data => {s
      console.log(data)
    } )
*/

  }
}

