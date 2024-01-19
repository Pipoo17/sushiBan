import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuService } from 'src/app/servizi/menu.service';
import { SupabaseService } from 'src/app/servizi/supabase.service';
import { MessageService } from 'src/app/servizi/message.service';

@Component({
  selector: 'app-email-form',
  templateUrl: './email-form.component.html',
  styleUrls: ['./email-form.component.css']
})
export class EmailFormComponent {
  isLoading : boolean = false;
  message: string = '';

  constructor(
    private supabaseService: SupabaseService,
    private servizioMenu: MenuService,
    private router: Router,
    private route: ActivatedRoute ,// Importa ActivatedRoute per ottenere i query parameters
    private MessageService: MessageService,
    //private ResponsiveSidebarComponent: ResponsiveSidebarComponent,

  ) {
    this.isLoading = false;
  }

  async onSubmit(form: NgForm){
    this.isLoading = true;

    let paramJson = form.value;


     let response = await this.supabaseService.restorePasswordRedirect(paramJson)

     if(!response.success){
       this.MessageService.showMessageError("",this.getMessageError(response.description))
     }
    else{
      this.MessageService.showMessageInfo("","Controlla la tua Email per completare il reset")

    }


    this.isLoading = false;

   
  }


  getMessageError(descErrore : any){
    if (descErrore == 'Password should be at least 6 characters'){
      return "La password deve avere alemno 6 caratteri";
    }
    else if (descErrore == 'Unable to validate email address: invalid format'){
      return"Email non valida.";
    }
    else if (descErrore == 'User already registered'){
      return"Questo utente è gia registrato.";
    }
    else if (descErrore == 'duplicate key value violates unique constraint "profiles_username_key'){
      return "Esiste già un utente con questo Username.";
    }
    else if (descErrore == 'Email rate limit exceeded'){
      return "Troppe richieste in arrivo : riprova tra un po." ;
    }
    else if (descErrore == 'insert or update on table "profiles" violates foreign key constraint "profiles_id_fkey"'){
      return "Esiste già un profilo connesso con questa email" ;
    }
    else{
      return "Errore : "+ descErrore;
    }
  }


}
