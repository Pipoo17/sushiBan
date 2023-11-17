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
  userOrder :any= ''

  constructor(
    public servizioMenu: MenuService, 
    private supabaseService: SupabaseService,
    private router: Router,
    )
  {

    this.supabaseService.checkIfUserAuth();

  }

  async ngOnInit(){
    try{
        console.log("test");
        let idUser  = await this.supabaseService.getUserId();

        this.userOrder = await this.supabaseService.getThisUserOrder(idUser)
        console.log("thisUserOrder : ",this.userOrder)






    //  this.supabaseService.getLastOrdineId(paramJson)
    //    .then((data) => {
    //      if (!data.success) {
    //        this.router.navigate(['/login']);
    //      }
    //      else{
    //        this.router.navigate(['/home']);
    //      }
    //    })
    //    .catch((error) => {
    //      console.error("Errore durante l'accesso:", error);
    //    });
    }catch{
  
    }
  }


async getYourOrder(){

  
}


}
