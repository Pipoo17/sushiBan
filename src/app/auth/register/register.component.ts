
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
  //constructor(private servizioMenu: MenuService,private router: Router){}
  @ViewChild('passwordInput') passwordInput: ElementRef<HTMLInputElement> | undefined;
  @ViewChild('passwordRepeatInput') passwordRepeatInput: ElementRef<HTMLInputElement> | undefined;

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
  isPasswordVisible : boolean = false

onSubmit(form: NgForm){
  this.isLoading= true;
  this.isBeforeLoading= false;



  try{
    let paramJson = form.value;
    console.log(paramJson);
    
    let controlliForm = this.controlliForm(paramJson)
    console.log(controlliForm);

    if(!controlliForm.success){
      console.log(controlliForm);
      
      this.MessageService.showMessageError("",controlliForm.description)
    }
    else{
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
    }




  }catch(error){
    console.error("Errore durante l'inserimento:", error);
    this.isLoading = false;
  }
  this.isLoading = false

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





