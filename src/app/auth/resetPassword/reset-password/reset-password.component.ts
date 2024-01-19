import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuService } from 'src/app/servizi/menu.service';
import { SupabaseService } from 'src/app/servizi/supabase.service';
import { MessageService } from 'src/app/servizi/message.service';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {


  isLoading : boolean = false;
  message: string = '';

  constructor(
    private supabaseService: SupabaseService,
    private servizioMenu: MenuService,
    private router: Router,
    private route: ActivatedRoute ,// Importa ActivatedRoute per ottenere i query parameters
    private MessageService: MessageService,
    //private ResponsiveSidebarComponent: ResponsiveSidebarComponent,

  ) {
    this.isLoading = false;

    
  }
  ngOnInit(){
    

  }

  async onSubmit(form: NgForm){
    this.isLoading = true;
    try{
      let paramJson = form.value;
        

      if(paramJson.Password == '' ||  paramJson.ripetiPassword == '' ){
        this.MessageService.showMessageWarning("","Completa il form per resettare la password")
      }
      else if(paramJson.Password != paramJson.ripetiPassword){
        this.MessageService.showMessageWarning("","Le password sono diverse")
      }else{
    
       let response = await this.supabaseService.restorePasswordUpdate(paramJson)
       console.log(response);

       if(!response.success){
          this.MessageService.showMessageError("", this.supabaseService.getMessageError(response.description + ''))
       }
       else{
         this.MessageService.showMessageSuccess("","Password Aggiornata!")
         this.router.navigate(['/login']);

       }
        }
    }catch(error){
      this.MessageService.showMessageError("","ERRORE")
    }

    this.isLoading = false;
   
  }



}
