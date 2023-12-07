import { Component, Input } from '@angular/core';
import { MenuService } from '../servizi/menu.service';
import { MessageService } from '../servizi/message.service';
import { SupabaseService } from '../servizi/supabase.service';


@Component({
  selector: 'app-card-piatto',
  templateUrl: './card-piatto.component.html',
  styleUrls: ['./card-piatto.component.css']
})
export class CardPiattoComponent {
  @Input() piatto: any; // Passa il piatto come input
  @Input() img: any; // Passa l'URL dell'immagine come input
  @Input() i!: number; // Aggiungi l'input per l'indice

  constructor(
    public servizioMenu: MenuService,
    public MessageService: MessageService,
    public SupabaseService: SupabaseService,
    ){}

  isClicked: boolean = false;

  pulsantePreferiti(index : number) {

    if(this.servizioMenu.menu[index].preferito){
      this.SupabaseService.removePreferiti(this.servizioMenu.menu[index].codice)
      .then((data) => {
        console.log(data);
        
        if(data.success == false){
          this.MessageService.showMessageError('',data.description)
        }else{
        this.servizioMenu.menu[index].preferito = !this.servizioMenu.menu[index].preferito
        this.isClicked = !this.isClicked;
        }
    })
  }else{
    this.SupabaseService.addPreferiti(this.servizioMenu.menu[index].codice)
    .then((data) => {
      console.log(data);
      
      if(data.success == false){
        this.MessageService.showMessageError('',data.description)
      }else{

      this.servizioMenu.menu[index].preferito = !this.servizioMenu.menu[index].preferito
      this.isClicked = !this.isClicked;
      }
    })
    .catch((error) => {
      this.MessageService.showMessageError('','error.description')
    });
}



  
  }

  aggiungiPiatto(i: number) {
    this.servizioMenu.aggiungiPiatto(i);
  }

  rimuoviPiatto(i: number) {
    this.servizioMenu.rimuoviPiatto(i);
  }
}
