import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuService } from 'src/app/servizi/menu.service';
import { SupabaseService } from 'src/app/servizi/supabase.service';
import { MessageService } from 'src/app/servizi/message.service';

@Component({
  selector: 'app-email-form',
  templateUrl: './email-form.component.html',
  styleUrls: ['./email-form.component.css']
})
export class EmailFormComponent {
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

  async onSubmit(form: NgForm){
    this.isLoading = true;

    let paramJson = form.value;


     let response = await this.supabaseService.restorePasswordRedirect(paramJson)

     if(!response.success){
       this.MessageService.showMessageError("",this.supabaseService.getMessageError(response.description))
     }
    else{
      this.MessageService.showMessageInfo("","Controlla la tua Email per completare il reset")

    }


    this.isLoading = false;

   
  }





}
