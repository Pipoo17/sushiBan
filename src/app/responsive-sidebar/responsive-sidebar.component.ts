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
immagineProfilo: any;
isLogged: any;

  constructor(
    public dialog: MatDialog,
    private supabaseService: SupabaseService,
    ) {
      this.getProfilePic();

      
      //this.supabaseService.isUserLogged().then((data) => {
      //  this.isLogged = data;
      //})

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

  async getProfilePic() {
    this.immagineProfilo =  await this.supabaseService.getProfilePic()

}

getIsUserLogged(){
  return this.supabaseService.getUserLogged();
}

  
}
