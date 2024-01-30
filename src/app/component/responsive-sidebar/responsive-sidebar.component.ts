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
userRole : any;
isAdmin : boolean = false;

  constructor(
    public dialog: MatDialog,
    private supabaseService: SupabaseService,
    ) {
      this.getProfilePic();
      
      //this.supabaseService.isUserLogged().then((data) => {
      //  this.isLogged = data;
      //})




    }

    async ngOnInit(){

      this.supabaseService.eventoLogin$.subscribe(async (dato) => {
        
        //aggiorna i dati del componente ogni volta che viene fatto il login
          this.getProfilePic();
          let userId = await this.supabaseService.getUserId();
          this.isAdmin = await this.isUserAdmin(userId)    


      });


      let userId = await this.supabaseService.getUserId();
      //this.userRole = await this.supabaseService.getUserRole(userId)
      
      
      this.isAdmin = await this.isUserAdmin(userId)
      
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

async isUserAdmin(userId : string){
  this.userRole = await this.supabaseService.getUserRole(userId)

  if(this.userRole == 1 || this.userRole == 2) return true
  return false
}

  
}
