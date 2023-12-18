import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MenuService } from 'src/app/servizi/menu.service';
import { SupabaseService } from 'src/app/servizi/supabase.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageService } from 'src/app/servizi/message.service';
import { ButtonModule } from 'primeng/button';


@Component({
  selector: 'app-carrello',
  templateUrl: './carrello.component.html',
  styleUrls: ['./carrello.component.css']
})
export class CarrelloComponent {
  message : string = '';

  constructor(
    public servizioMenu: MenuService,
    private supabaseService: SupabaseService,
    private dialogRef: MatDialogRef<CarrelloComponent>,
    private router: Router,
    private snackBar: MatSnackBar, 
    private MessageService: MessageService, 
    private ButtonModule: ButtonModule, 
  ) {}

  ngOnInit(): void {}

  isLoading : boolean = false;

  onSubmit(azione: string) {
    let paramJson = this.servizioMenu.getOrdine();
    this.isLoading = true;

    // inserimento ordine
    if(azione == 'invia'){
    this.supabaseService.insertOrdine(paramJson)
      .then((data) => {

        if(data.success){
          console.log("Inserimento riuscito");
          console.log("Animazione:");

          this.dialogRef.close();
          this.MessageService.showMessageSuccess('','Ordine inserito correttamente!')
          this.router.navigate(['/ordini']);
        }

        else{
          console.error(data.description)
          this.message = data.description;
          this.MessageService.showMessageWarning('Attenzione',this.message)
          // if(data.description = ''){
        //     this.message
        // }else{
        //   this.message = data.description;
        // }
        }
        
      })
      .catch((error) => {
        this.MessageService.showMessageError('Errore',error)
        console.error("Errore durante l'inserimento:", error);
      });
    }
    // salvataggio ordine
    else if(azione == 'salva'){
      console.log("salva");
      
      this.supabaseService.salvataggioOrdine(paramJson)
      .then((data) => {
        if(data.success){
          console.log("Salvataggio riuscito");


          this.MessageService.showMessageSuccess('','Ordine salvato correttamente!')
        }

        else{
          console.error(data.description)
          this.MessageService.showMessageWarning('Attenzione',data.description+'')

        }
      })
      .catch((error) => {
        this.MessageService.showMessageError('Errore',error)
        console.error("Errore durante l'inserimento:", error);
      });

      
    }
    this.isLoading = false;
  }


  salvaOrdine(){
    console.log("salvaOrdine");
    
  }



}
