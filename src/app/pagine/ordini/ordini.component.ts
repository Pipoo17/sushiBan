import { Component, Input, OnInit } from '@angular/core';
import { MenuService } from 'src/app/servizi/menu.service';
import { SupabaseService } from 'src/app/servizi/supabase.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-ordini',
  templateUrl: './ordini.component.html',
  styleUrls: ['./ordini.component.css']
})
export class OrdiniComponent {
  userOrder :any= ''

  constructor(
    public servizioMenu: MenuService, 
    private supabaseService: SupabaseService,
    private router: Router,
    )
  {
    this.supabaseService.setUserLogged(true)
    this.supabaseService.checkIfUserAuth();
    

  }

  async ngOnInit(){
    try{
        console.log("test");
        let idUser  = await this.supabaseService.getUserId();
        console.log("idUser : ",idUser);
        
        let ordine = await this.supabaseService.getThisUserOrder(idUser)
        console.log("ordine : ",ordine);

        this.userOrder = ordine
        //if(ordine[0].idPiatto = 'error'){
        //  //TODO : gestione errore
        //}

       // ordine.forEach(piatto => {
       //    // let nomePiatto = this.supabaseService.get
       // });
        
 

    }catch{
  
    }
  }


}
