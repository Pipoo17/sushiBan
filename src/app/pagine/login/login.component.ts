import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuService } from 'src/app/servizi/menu.service';
import { SupabaseService } from 'src/app/servizi/supabase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  message: string = '';
  registrationSuccess: boolean = false;
  logoutSuccess: boolean = false;


  constructor(
    private supabaseService: SupabaseService,
    private servizioMenu: MenuService,
    private router: Router,
    private route: ActivatedRoute // Importa ActivatedRoute per ottenere i query parameters
  ) {}



  onSubmit(form: NgForm){
    try{
      let paramJson = form.value;
      this.supabaseService.login(paramJson)
        .then(() => {
            //gestire nel front end gli errori (pass min 6 caratteri ... )
            
        })
        .catch((error) => {
          console.error("Errore durante l'accesso:", error);
        });
    }catch{
  
    }
  }
  
}
