
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

          if (data.description == 'Password should be at least 6 characters'){
            this.message ="La password deve avere alemno 6 caratteri";
            console.log('errore gestito')
          }
          else if (data.description == 'Unable to validate email address: invalid format'){
            this.message ="Email non valida";
            console.log('errore gestito')
          }
          else if (data.description == 'User already registered'){
            this.message ="Questo utente è gia registrato";
            console.log('errore gestito')
          }
          else if (data.description == 'duplicate key value violates unique constraint "profiles_username_key'){
            this.message ="Esista già un utente con questo Username";
            console.log('errore gestito')
          }
          else{
            this.message ="Errore nella recistrazione : ",data.description;
            console.log('errore da gestire')
          }
          
          // Gestisci l'errore nel front end, ad esempio mostrando un messaggio all'utente
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


}
