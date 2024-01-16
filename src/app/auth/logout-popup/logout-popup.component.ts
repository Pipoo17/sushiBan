import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SupabaseService } from 'src/app/servizi/supabase.service';
import { MessageService } from 'src/app/servizi/message.service';


@Component({
  selector: 'app-logout-popup',
  templateUrl: './logout-popup.component.html',
  styleUrls: ['./logout-popup.component.css'],
})
export class LogoutPopupComponent {
  constructor(
    private router: Router,
    private supabaseService: SupabaseService,
    private MessageService: MessageService,
    ) {}


  logout() {
    this.supabaseService.logout()
    this.MessageService.showMessageSuccess('','Logout avvenuto con successo')
    this.router.navigate(['/login']);
    this
  }
}
