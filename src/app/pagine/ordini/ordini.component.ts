import { Component, Input, OnInit } from '@angular/core';
import { MenuService } from 'src/app/servizi/menu.service';
import { SupabaseService } from 'src/app/servizi/supabase.service';
import { Router } from '@angular/router';
import { LottieTransferState } from 'ngx-lottie';
import { Injectable } from '@angular/core';

@Component({
  selector: 'app-ordini',
  templateUrl: './ordini.component.html',
  styleUrls: ['./ordini.component.css']
})
export class OrdiniComponent {
  quantiClienti: any 

  userOrder :any= [];
  allUsersOrder: any=[];

  userOrderLabel: string = ''
  allUserOrdersLabel: string = ''

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
    //this.quantiClienti = await this.supabaseService.getQuantiClienti();
    //TRY ORDINE PERSONALE
    this.thisUserOrder();
    //TRY ORDINE GENERALE
   this.allUsersOrders();
  }




async thisUserOrder(){
    this.userOrder = []; 
    try{
      let idUser  = await this.supabaseService.getUserId();
      let ordine = await this.supabaseService.getThisUserOrder(idUser)

      //console.log("ordine : ",ordine);
      if(ordine.length == 0){
        this.userOrder = []
        this.userOrderLabel = 'Qui potrai visualizzare il tuo ordine una volta fatto'
      }
     else if(ordine[0].idPiatto == 'error'){
       //TODO : gestione errore
     }
      else{
        for (const piatto of ordine) {
          let nomePiatto = await this.supabaseService.getCodicePiattoFromId(piatto.idPiatto)
          this.userOrder.push({
            id: piatto.idPiatto,
            idPiatto: nomePiatto.idPiatto,
            numeroPiatto: piatto.numeroPiatti
          });
        }
      }
     
  }catch(error){
    console.error(error);
    this.userOrderLabel = 'ERRORE : '+error
    }

  }

async allUsersOrders(){
  this.allUserOrdersLabel = ''
  this.allUsersOrder = []; 
  console.log('this.quantiClienti : ',this.quantiClienti);
  
  this.quantiClienti = await this.supabaseService.getQuantiClienti();
  console.log('this.quantiClienti : ',this.quantiClienti);

  try{
    let allUsersOrder : any = []
    allUsersOrder = await this.supabaseService.getAllUsersOrder()
    console.log("allUsersOrder : ",allUsersOrder);

    if(allUsersOrder.length == 0){
       this.allUsersOrder = []
       this.allUserOrdersLabel = 'Qui potrai vedere gli ordini di tutti i partecipanti'
    }
    else{
      for (const piatto of allUsersOrder) {
        this.allUsersOrder.push({
          id : piatto.id,
          idPiatto: piatto.codice,
          numeroPiatto: piatto.numeropiatti
        });
      }
    }

  }catch(error){
    console.error(error);
    this.allUserOrdersLabel = 'ERRORE : '+error;
    
  }
}


async deleteOrdine(){
  this.allUserOrdersLabel = ''
  await this.supabaseService.deleteOrder();
  this.userOrder = []
  this.userOrderLabel = 'Ordine annullato correttamente!'
  
  
  this.allUsersOrder = await this.allUsersOrders();
  

  if (!this.allUsersOrder || this.allUsersOrder.length === 0) {
    this.allUserOrdersLabel = 'Qui potrai vedere gli ordini di tutti i partecipanti'

  }
}

async getImmagineUrlFromName(nomePiatto: string){
  return await this.supabaseService.getImmagineUrlFromName("immaginiPiatti", nomePiatto);
}


}
