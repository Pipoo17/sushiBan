import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MenuService } from 'src/app/servizi/menu.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  constructor(private servizioMenu: MenuService,private router: Router){}
  message: string = '';

  onSubmit(form: NgForm) {
    const email = form.value.email;
    const password = form.value.password;    
    const username = form.value.username;
    const nome = form.value.nome;
    const cognome = form.value.cognome;

    this.servizioMenu.signUp(email, password)
      .subscribe(
        () => {
          this.message ='Registrazione avvenuta con successo!';
           this.router.navigate(['/login'], { queryParams: { registrationSuccess: true } });
          form.reset();
        },
        error => {
          //console.error('Errore durante la registrazione:', error);
          const errorMessage = error?.error?.error?.message
          if (errorMessage === 'EMAIL_EXISTS') {
            this.message ="La mail inserita è già in uso.";
          } 
          else if (password.length < 6) {
            this.message ="La Password deve contenere almeno 6 caratteri.";
          } 
          else {
            this.message ='Si è verificato un errore durante la registrazione.';
          }
          console.log(this.message)
        }
      );
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