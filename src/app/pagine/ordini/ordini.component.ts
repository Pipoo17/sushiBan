import { Component, Input, OnInit } from '@angular/core';
import { MenuService } from 'src/app/servizi/menu.service';
import { SupabaseService } from 'src/app/servizi/supabase.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-ordini',
  templateUrl: './ordini.component.html',
  styleUrls: ['./ordini.component.css']
})
export class OrdiniComponent {


  constructor(
    public servizioMenu: MenuService, 
    private supabaseService: SupabaseService,
    private router: Router,
    )
  {
    this.checkUserLoginStatus();

  }

  async checkUserLoginStatus() {
    const isUserLoggedIn = await this.supabaseService.isUserLogged();
    if (!isUserLoggedIn) {
      this.router.navigate(['/login']);
      // L'utente è loggato, puoi gestire l'accesso alla pagina
    } 
     // L'utente non è loggato, reindirizzalo alla pagina di login
  }
}
