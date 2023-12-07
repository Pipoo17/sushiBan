import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuService } from 'src/app/servizi/menu.service';
import { SupabaseService } from 'src/app/servizi/supabase.service';
import { MessageService } from 'src/app/servizi/message.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  message: string = '';
  //registrationSuccess: boolean = false;
  //logoutSuccess: boolean = false;
  authError : boolean = false;
  isLoading : boolean = false;

  constructor(
    private supabaseService: SupabaseService,
    private servizioMenu: MenuService,
    private router: Router,
    private route: ActivatedRoute ,// Importa ActivatedRoute per ottenere i query parameters
    private MessageService: MessageService,
  ) {
    this.supabaseService.setUserLogged(false)
    this.isLoading = false;
  }



  onSubmit(form: NgForm){
    try{
      this.isLoading = true;
      let paramJson = form.value;
      this.supabaseService.login(paramJson)
        .then((data) => {
          this.isLoading = false;

          if (!data.success) {
            this.authError = true
            this.MessageService.showMessageError('',this.getMessageError(data.description))
            this.router.navigate(['/login']);
          }
          else{
            this.MessageService.deleteMessage();
            this.MessageService.showMessageSuccess('','Accesso avvenuto con successo')
            this.router.navigate(['/home']);
          }
        })
        .catch((error) => {
          this.isLoading = false;
          this.MessageService.showMessageError('',this.getMessageError(error))
          console.error("Errore durante l'accesso:", error);
        });
    }catch(error){
      this.isLoading = false;
      this.MessageService.showMessageError('',this.getMessageError(error))
      console.error("Errore durante l'accesso:", error);
    }
  }
  

  getMessageError(descErrore : any){
    if (descErrore == 'Invalid login credentials'){
      return "Email o password sono sbagliati";
    }
    if (descErrore == 'Email not confirmed'){
      return "Completa la registrazione tramite la mail ricevuta";
    }
    else{
      return "Errore nell' accesso : "+ descErrore;
    }
  }

  

}
