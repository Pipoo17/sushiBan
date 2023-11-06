import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SupabaseService } from 'src/app/servizi/supabase.service';

@Component({
  selector: 'app-logout-popup',
  templateUrl: './logout-popup.component.html',
  styleUrls: ['./logout-popup.component.css'],
})
export class LogoutPopupComponent {
  constructor(
    private router: Router,
    private supabaseService: SupabaseService,
    ) {}
  logout() {
    // Rimuovi i dati relativi al profilo loggato (user) dal localStorage
    //console.log("Logout")
    //localStorage.removeItem('user');
    //// Reindirizza alla pagina di login (assumendo che il percorso sia '/login')
    //this.router.navigate(['/login'], { queryParams: { logoutSuccess: true } });
    this.supabaseService.logout()
  }
}
