
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MenuService } from 'src/app/servizi/menu.service';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/servizi/supabase.service';
import { MessageService } from 'src/app/servizi/message.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  //constructor(private servizioMenu: MenuService,private router: Router){}
  
  constructor(
    public servizioMenu: MenuService,
    private supabaseService: SupabaseService,
    private router: Router,
    private MessageService: MessageService,
    
  ) {}
  message: string = '';
  authError : boolean = false;
  isLoading : boolean = false;
  isBeforeLoading : boolean = true;

onSubmit(form: NgForm){
  this.isLoading= true;
  this.isBeforeLoading= false;
  
  try{
    let paramJson = form.value;
    this.supabaseService.register(paramJson)
      .then((data) => {
        this.isLoading = false;
        if (data.success == false) {
          this.authError = true,
          console.error("ERRORE : ", data.description);
          this.MessageService.showMessageError('',this.getMessageError(data.description))
        }else {
          this.isLoading = false;
          this.MessageService.showMessageInfo('',"Conferma la mail per completare la registrazione")
          console.log('Conferma Mail')
      // Puoi gestire la conferma dell'email o altre azioni qui
    }

    this.router.navigate(['/register']);

      })
      .catch((error) => {
        this.isLoading = false;
        console.error("Errore durante l'inserimento:", error);
      });
  }catch(error){
    console.error("Errore durante l'inserimento:", error);
    this.isLoading = false;
  }
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
    return "Esiste già un profilo con quella email" ;
  }
  else{
    return "Errore nella registrazione : "+ descErrore;
  }
}


}





