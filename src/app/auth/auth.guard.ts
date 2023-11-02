import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { MenuService } from 'src/app/servizi/menu.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private menuService: MenuService) {}

  canActivate(): boolean {
    // Implementa qui la logica per verificare se l'utente è loggato
    // Puoi utilizzare il servizio di autenticazione o un'altra logica personalizzata
    
    // Esempio: controlla se l'utente è autenticato nel tuo servizio di autenticazione
    const isAuthenticated = this.menuService.isAuthenticated();

    if (isAuthenticated) {
      return true; // L'utente è autenticato, permetti la navigazione
    } else {
      this.router.navigate(['/login']); // Reindirizza l'utente alla pagina di login
      return false; // Blocca la navigazione
    }
  }
}
