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


onSubmit(form: NgForm){
  try{
    let paramJson = form.value;
    this.supabaseService.register(paramJson)
      .then(() => {
          //gestire nel front end gli errori (pass min 6 caratteri ... )
          //mostrare pop up che chiede di confermare la mail
      })
      .catch((error) => {
        console.error("Errore durante l'inserimento:", error);
      });
  }catch{

  }
}


}



/*

        error => {
          //console.error('Errore durante la registrazione:', error);
          if (error?.error?.error?.message === 'EMAIL_EXISTS') {
            this.message ="La mail inserita è già in uso.";
          } 
          else {
            this.message ='Si è verificato un errore durante la registrazione.';
          }
          console.log(this.message)
        }*/