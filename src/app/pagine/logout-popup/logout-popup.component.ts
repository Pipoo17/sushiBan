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
    this.supabaseService.logout()
    this.router.navigate(['/login']);
  }
}
