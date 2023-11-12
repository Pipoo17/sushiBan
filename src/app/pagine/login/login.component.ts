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
  //registrationSuccess: boolean = false;
  //logoutSuccess: boolean = false;
  authError : boolean = false;

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
        .then((data) => {
          if (!data.success) {
            this.authError = true
            this.message = this.getMessageError(data.description)
            this.router.navigate(['/login']);
          }
          else{
            this.router.navigate(['/home']);
          }
        })
        .catch((error) => {
          console.error("Errore durante l'accesso:", error);
        });
    }catch{
  
    }
  }
  

  getMessageError(descErrore : any){
    if (descErrore == 'Invalid login credentials'){
      return "Email o password sono sbagliati";
    }
    else{
      return "Errore nell' accesso : "+ descErrore;
    }
  }

}
