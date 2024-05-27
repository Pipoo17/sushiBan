import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuService } from 'src/app/servizi/menu.service';
import { SupabaseService } from 'src/app/servizi/supabase.service';
import { MessageService } from 'src/app/servizi/message.service';
//import { ResponsiveSidebarComponent } from 'src/app/responsive-sidebar/responsive-sidebar.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @ViewChild('passwordInput') passwordInput: ElementRef<HTMLInputElement> | undefined;

  message: string = '';
  //registrationSuccess: boolean = false;
  //logoutSuccess: boolean = false;
  authError : boolean = false;
  isLoading : boolean = false;
  isPasswordVisible : boolean = false

  constructor(
    private supabaseService: SupabaseService,
    private servizioMenu: MenuService,
    private router: Router,
    private route: ActivatedRoute ,// Importa ActivatedRoute per ottenere i query parameters
    private MessageService: MessageService,
    //private ResponsiveSidebarComponent: ResponsiveSidebarComponent,

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
            //this.ResponsiveSidebarComponent.getProfilePic();
            this.servizioMenu.riempiMenu();
            this.supabaseService.eventoLogin(data)
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

  togglePasswordVisibility() {
    if(this.passwordInput){
    const input = this.passwordInput.nativeElement;
    input.type = input.type === 'password' ? 'text' : 'password';
    this.isPasswordVisible = !this.isPasswordVisible
  }
}


}
