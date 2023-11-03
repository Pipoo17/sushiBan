import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MenuService } from 'src/app/servizi/menu.service';
import { SupabaseService } from 'src/app/servizi/supabase.service';

@Component({
  selector: 'app-carrello',
  templateUrl: './carrello.component.html',
  styleUrls: ['./carrello.component.css']
})
export class CarrelloComponent {

  constructor(
    public servizioMenu: MenuService,
    private supabaseService: SupabaseService,
    private dialogRef: MatDialogRef<CarrelloComponent>
  ) {}

  ngOnInit(): void {}

  onSubmit() {
    let paramJson = this.servizioMenu.getOrdine();
    this.servizioMenu.insertOrdine(paramJson)
      .then(() => {
        console.log("Inserimento riuscito");
        console.log("Animazione:");
        
        // Chiudi il dialog corrente
        this.dialogRef.close();
        //TODO
        //Apertura Dialog che contiene l'animazione dei successo  
        
      })
      .catch((error) => {
        console.error("Errore durante l'inserimento:", error);
      });
  }
}
