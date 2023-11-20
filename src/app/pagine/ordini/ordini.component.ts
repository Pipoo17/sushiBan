import { Component, Input, OnInit } from '@angular/core';
import { MenuService } from 'src/app/servizi/menu.service';
import { SupabaseService } from 'src/app/servizi/supabase.service';
import { Router } from '@angular/router';
import { LottieTransferState } from 'ngx-lottie';


@Component({
  selector: 'app-ordini',
  templateUrl: './ordini.component.html',
  styleUrls: ['./ordini.component.css']
})
export class OrdiniComponent {
  userOrder :any= []

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
        //console.log("ordine : ",ordine);
        
      console.log(ordine.length);
      
       if(ordine[0].idPiatto == 'error'){
         //TODO : gestione errore
       }
       else{
        if(ordine.length == 0){
           this.userOrder = []
        }
        else{
          for (const piatto of ordine) {
            let nomePiatto = await this.supabaseService.getCodicePiattoFromId(piatto.idPiatto)
            this.userOrder.push({
              idPiatto: nomePiatto.idPiatto,
              numeroPiatto: piatto.numeroPiatti
            });
            console.log("idPiatto: ", piatto.idPiatto);
            console.log("numeroPiatti: ", piatto.numeroPiatti);
            console.log("------------------");
          }
          //this.userOrder = ordine

        }

       }

       //ordine.forEach(piatto => {
       //    let nomePiatto = this.supabaseService.getCodicePiattoFromId(piatto.idPiatto)
       //      this.userOrder.push({
       //       idPiatto: nomePiatto,
       //       numeroPiatto: piatto.numeroPiatti
       //     });
       //});
       
    }catch(error){
      console.error(error);
      
    }
  }


}
