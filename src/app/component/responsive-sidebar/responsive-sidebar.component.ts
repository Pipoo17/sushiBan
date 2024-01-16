import { Component, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LogoutPopupComponent } from '../../auth/logout-popup/logout-popup.component';
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
        console.log('Logout eseguito!');
      } else {
        console.log('Logout annullato');
      }
    });
  }

  async getProfilePic() {
    this.immagineProfilo = this.supabaseService.getPictureURL('avatars',await this.supabaseService.getUserName())
    //this.immagineProfilo = await this.supabaseService.getProfilePic() + `?timestamp=${new Date().getTime()}`;
  }

getIsUserLogged(){
  return this.supabaseService.getUserLogged();
}

  
}
