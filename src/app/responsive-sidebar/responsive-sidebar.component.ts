import { Component, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LogoutPopupComponent } from '../pagine/logout-popup/logout-popup.component';
import { SupabaseService } from 'src/app/servizi/supabase.service';

@Component({
  selector: 'app-responsive-sidebar',
  templateUrl: './responsive-sidebar.component.html',
  styleUrls: ['./responsive-sidebar.component.css'],
})
export class ResponsiveSidebarComponent {
  constructor(
    public dialog: MatDialog,
    private supabaseService: SupabaseService,
    ) {

      this.getImmagineUrlFromName();
    }

  openLogoutDialog(): void {
    const dialogRef = this.dialog.open(LogoutPopupComponent, {
      width: '40 em',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        // Esegui qui il codice per la logout
        console.log('Logout eseguito!');
        // Aggiungi il codice effettivo per la logout, come svuotare le credenziali di autenticazione, ecc.
      } else {
        console.log('Logout annullato');
      }
    });
  }

  async getImmagineUrlFromName() {
    let data = await this.supabaseService.getSession()

    console.log("Dati della sessione:", data);

    //TODO : QUERY CHE RITORNA IL NOME DELLA IMMAGINE PROFILO

    let url = await this.supabaseService.getImmagineUrlFromName("avatars", "asd");
    console.log("url : ",url)


}


  
}
