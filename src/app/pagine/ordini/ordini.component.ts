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

    this.supabaseService.checkIfUserAuth();
  }




async getYourOrder(){

  
}


}
