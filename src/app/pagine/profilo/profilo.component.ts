import { Component } from '@angular/core';
import { SupabaseService } from 'src/app/servizi/supabase.service';
import { MenuService } from 'src/app/servizi/menu.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-profilo',
  templateUrl: './profilo.component.html',
  styleUrls: ['./profilo.component.css']
})
export class ProfiloComponent {
  immagineProfilo: any;
  profileSession: any;
  username : any;

  constructor(
    public servizioMenu: MenuService,
    private supabaseService: SupabaseService,
    private router: Router
    
  ) {
    this.getProfilePic();
    this.setProfileData();
    this.supabaseService.checkAuth();
  }



  //////query //////

  async getProfilePic() {
    this.immagineProfilo =  await this.supabaseService.getProfilePic()
  }

  async setProfileData() {
    let sessionData =  await this.supabaseService.getSession()
    this.profileSession =  sessionData.session?.user
    this.username = sessionData.session?.user.user_metadata['username']
  }



}
