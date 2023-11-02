import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { MenuService } from 'src/app/servizi/menu.service';

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
    private servizioMenu: MenuService,
    private router: Router,
    private route: ActivatedRoute // Importa ActivatedRoute per ottenere i query parameters
  ) {}

  ngOnInit() {
    // Recupera i query parameters e verifica se c'è un messaggio di registrazione avvenuta con successo
    this.route.queryParams.subscribe((params) => {
      if (params['registrationSuccess']) {
        this.registrationSuccess = true
        this.message = 'Registrazione avvenuta con successo!';
      }
      if (params['logoutSuccess']) {
        this.logoutSuccess = true;
        this.message = 'Logout effettuato con successo!';
      }
    });
  }
  
  onSubmit(form : NgForm){
    console.log(form)
    const email = form.value.email;
    const password = form.value.password;
    //console.log(email);
    //console.log(password);

    this.servizioMenu.signIn(email, password).subscribe(
      (data: any) => {
        // Login con successo
        const expirationDate = new Date(new Date().getTime() + data.expiresIn * 1000);
        this.servizioMenu.createUser(data.email, data.localId, data.idToken, expirationDate);
        localStorage.setItem('user', JSON.stringify(this.servizioMenu.user));
        this.router.navigate(['/home']);
      },
      (error: any) => {
        // Gestione degli errori
        if (error.error && error.error.error && error.error.error.message) {
          const errorMessage = error.error.error.message;
          if (errorMessage === 'EMAIL_NOT_FOUND') {
            this.message ="La mail non è associata a nessun profilo";
            // Esegui le azioni appropriate per un profilo inesistente
          } else if (errorMessage === 'INVALID_PASSWORD') {
            this.message ="Password errata";
            // Esegui le azioni appropriate per una password errata
          } else {
            this.message ="Si è verificato un errore durante l'accesso";
            // Esegui le azioni appropriate per altri tipi di errore
          }
        }
      }
    );
    
    
    
  }
}
