import { Component, ElementRef, ViewChild } from '@angular/core';
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
  @ViewChild('passwordInput') passwordInput: ElementRef<HTMLInputElement> | undefined;
  @ViewChild('passwordRepeatInput') passwordRepeatInput: ElementRef<HTMLInputElement> | undefined;

  isLoading: boolean = false;
  isPasswordVisible: boolean = false;

  constructor(
    public servizioMenu: MenuService,
    private supabaseService: SupabaseService,
    private router: Router,
    private messageService: MessageService,
  ) {}

  onSubmit(form: NgForm) {
    this.isLoading = true;

    try {
      let paramJson = form.value;
      let controlliForm = this.controlliForm(paramJson);

      if (!controlliForm.success) {
        this.isLoading = false;
        this.messageService.showMessageError("", this.supabaseService.getMessageError(controlliForm.description));
      } else {
        this.supabaseService.register(paramJson)
          .then((data) => {
            this.isLoading = false;

            if (data.success == false) {
              this.messageService.showMessageError('', this.supabaseService.getMessageError(data.description));
            } else {
              console.log('Conferma Mail');
              this.messageService.showMessageInfo('', "Conferma la mail per completare la registrazione");
            }

            this.router.navigate(['/register']);
          })
          .catch((error) => {
            this.isLoading = false;
            console.error("Errore durante l'inserimento:", error);
          });
      }
    } catch (error) {
      this.isLoading = false;
      console.error("Errore durante l'inserimento:", error);
    }
  }

controlliForm(paramJson : any){

  let password = paramJson.password
  let ripetiPassword = paramJson.ripetiPassword
  let email = paramJson.email
  let userName = paramJson.username

  if (!(password && ripetiPassword && email && userName) || password.trim() === '' || ripetiPassword.trim() === '' || email.trim() === '' || userName.trim() === '') {
    return { success: false, description: 'Valorizza tutti i campi' };
  }

  console.log(this.checkPassword(password, ripetiPassword));
  
  if(!this.checkPassword(password, ripetiPassword)){
    return { success: false, description: 'Le password sono diverse' };
  }

  if(!this.supabaseService.isValidEmail(email)){
    return { success: false, description: 'Inserisci una Email valida' };
  }


  return { success: true, description: 'Form Corretto' };

}


togglePasswordVisibility() {
  if(this.passwordInput && this.passwordRepeatInput){
    let input = this.passwordInput.nativeElement;
    input.type = input.type === 'password' ? 'text' : 'password';
    input = this.passwordRepeatInput.nativeElement;
    input.type = input.type === 'password' ? 'text' : 'password';
    this.isPasswordVisible = !this.isPasswordVisible
  }
}

 checkPassword(password: string, ripetiPassword: string): boolean {
  console.log(password);
  console.log(ripetiPassword);
  
  return password == ripetiPassword;
}

}





