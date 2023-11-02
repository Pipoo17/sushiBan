import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-logout-popup',
  templateUrl: './logout-popup.component.html',
  styleUrls: ['./logout-popup.component.css'],
})
export class LogoutPopupComponent {
  constructor(private router: Router) {}
  logout() {
    // Rimuovi i dati relativi al profilo loggato (user) dal localStorage
    console.log("Logout")
    localStorage.removeItem('user');
    // Reindirizza alla pagina di login (assumendo che il percorso sia '/login')
    this.router.navigate(['/login'], { queryParams: { logoutSuccess: true } });
  }
}
