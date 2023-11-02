import { Component, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LogoutPopupComponent } from '../pagine/logout-popup/logout-popup.component';


@Component({
  selector: 'app-responsive-sidebar',
  templateUrl: './responsive-sidebar.component.html',
  styleUrls: ['./responsive-sidebar.component.css'],
})
export class ResponsiveSidebarComponent {
  constructor(public dialog: MatDialog) {}

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
}
