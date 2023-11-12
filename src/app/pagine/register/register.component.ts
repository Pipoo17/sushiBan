
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MenuService } from 'src/app/servizi/menu.service';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/servizi/supabase.service';
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
    private router: Router
    
  ) {}
  message: string = '';
  authError : boolean = false;


onSubmit(form: NgForm){
  try{
    let paramJson = form.value;
    this.supabaseService.register(paramJson)
      .then((data) => {
        if (data.success == false) {
          this.authError = true,
          console.error("ERRORE : ", data.description);
          this.message = this.getMessageError(data.description)

        }else {
          this.message ="Conferma la mail per completare la registrazione";
          console.log('Conferma Mail')
      // Puoi gestire la conferma dell'email o altre azioni qui
    }

    this.router.navigate(['/register']);

      })
      .catch((error) => {
        console.error("Errore durante l'inserimento:", error);
      });
  }catch{

  }
}


getMessageError(descErrore : any){
  if (descErrore == 'Password should be at least 6 characters'){
    return "La password deve avere alemno 6 caratteri";
  }
  else if (descErrore == 'Unable to validate email address: invalid format'){
    return"Email non valida";
  }
  else if (descErrore == 'User already registered'){
    return"Questo utente è gia registrato";
  }
  else if (descErrore == 'duplicate key value violates unique constraint "profiles_username_key'){
    return "Esista già un utente con questo Username";
  }
  else{
    return "Errore nella registrazione : "+ descErrore;
  }
}


}





