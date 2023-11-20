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
  userOrder :any= [];
  allUsersOrder: any=[];

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
    //TRY ORDINE PERSONALE
    try{
        let idUser  = await this.supabaseService.getUserId();
        let ordine = await this.supabaseService.getThisUserOrder(idUser)

        //console.log("ordine : ",ordine);
            
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
          }

        }

       }


       
    }catch(error){
      console.error(error);
      
    }
    //TRY ORDINE GENERALE
    try{
      let allUsersOrder : any = []
      allUsersOrder = await this.supabaseService.getAllUsersOrder()
      console.log("allUsersOrder : ",allUsersOrder);

      if(allUsersOrder.length == 0){
         this.userOrder = []
      }
      else{
        for (const piatto of allUsersOrder) {
          this.allUsersOrder.push({
            idPiatto: piatto.codice,
            numeroPiatto: piatto.numeropiatti
          });
        }
      }

    }catch(error){
      console.error(error);
      
    }
  }


}
