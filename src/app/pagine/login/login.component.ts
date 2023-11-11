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

    console.log('this.authError : ',this.authError)
    try{
      let paramJson = form.value;
      this.supabaseService.login(paramJson)
        .then((data) => {
            if(data.user == null){
              this.authError = true
              this.message ="Le credenziali sono errate";
              this.router.navigate(['/login']);
            }
            else{
              this.router.navigate(['/home']);
            }

        })
        .catch((error) => {
          console.log(error)
          console.error("Errore durante l'accesso:", error);
        });
    }catch{
  
    }
  }
  
}
