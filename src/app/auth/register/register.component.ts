
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
          this.MessageService.showMessageError('',this.supabaseService.getMessageError(data.description))
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





}





