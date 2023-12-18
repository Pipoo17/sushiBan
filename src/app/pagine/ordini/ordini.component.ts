import { Component, Input, OnInit } from '@angular/core';
import { MenuService } from 'src/app/servizi/menu.service';
import { SupabaseService } from 'src/app/servizi/supabase.service';
import { Router } from '@angular/router';
import { LottieTransferState } from 'ngx-lottie';
import { Injectable } from '@angular/core';
import { MessageService } from 'src/app/servizi/message.service';

@Component({
  selector: 'app-ordini',
  templateUrl: './ordini.component.html',
  styleUrls: ['./ordini.component.css']
})
export class OrdiniComponent {
  quantiClienti: any 
  isLoading : boolean = false;
  userOrder :any= [];
  allUsersOrder: any=[];

  userOrderLabel: string = ''
  allUserOrdersLabel: string = ''

  constructor(
    public servizioMenu: MenuService, 
    private supabaseService: SupabaseService,
    private router: Router,
    private MessageService: MessageService,
    )
  {
    this.supabaseService.checkAuth();

    
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

      console.log("ordine : ",ordine);
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
          let descrizionePiatto = await this.supabaseService.getDescrizionePiattoFromId(piatto.idPiatto)
          
          this.userOrder.push({
            id: piatto.idPiatto,
            idPiatto: nomePiatto.idPiatto,
            numeroPiatto: piatto.numeroPiatti,
            descrizione: descrizionePiatto.descrizione
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
          numeroPiatto: piatto.numeropiatti,
          descrizione: piatto.descrizione
        });
      }
    }

  }catch(error){
    console.error(error);
    this.allUserOrdersLabel = 'ERRORE : '+error;
    
  }
}


async deleteOrdine(){
  this.isLoading = true;
  this.allUserOrdersLabel = ''
  await this.supabaseService.deleteOrder();
  this.isLoading = false;
  this.userOrder = []
  this.userOrderLabel = 'Qui potrai vedere gli ordini di tutti i partecipanti'
  this.MessageService.showMessageSuccess('','Ordine annullato correttamente!')
  
  
  await this.allUsersOrders();
  

  if (!this.allUsersOrder || this.allUsersOrder.length === 0) {
    this.allUserOrdersLabel = 'Qui potrai vedere gli ordini di tutti i partecipanti'

  }
}

async copyOrdine() {
  let copyOrder: string = await this.orderToString(); // Attendi la risoluzione della Promise
  copyOrder += ' per '+this.quantiClienti + ' persone';
  this.saveTextToClipboard(copyOrder);
  this.MessageService.showMessageSuccess('','Ordine Copiato')
}

async orderToString(): Promise<string> {
  let copyOrder: string = '';
  let allUsersOrder: any = [];
  allUsersOrder = await this.supabaseService.getAllUsersOrder();

  if (allUsersOrder.length == 0) {
    this.allUsersOrder = [];
    this.allUserOrdersLabel = 'Qui potrai vedere gli ordini di tutti i partecipanti';
  } else {
    let orderItems: string[] = [];

    for (const piatto of allUsersOrder) {
      orderItems.push(`${piatto.codice} x ${piatto.numeropiatti}`);
    }

    copyOrder = orderItems.join(', ');
  }
  return copyOrder; 
}


 saveTextToClipboard(testoDaCopiare: string): void {
  // Utilizza l'API del documento per copiare il testo negli appunti
  const textarea = document.createElement('textarea');
  textarea.value = testoDaCopiare;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);

}


//Metodo getImmaginiPiatti
getImmagineUrlFromName(nomePiatto: string){
  return `https://lcitxbybmixksqmlyyzb.supabase.co/storage/v1/object/public/immaginiPiatti/${nomePiatto}.jpg`;
}




}
