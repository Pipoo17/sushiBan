// profilo.component.ts

import { Component } from '@angular/core';
import { SupabaseService } from 'src/app/servizi/supabase.service';
import { MenuService } from 'src/app/servizi/menu.service';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/servizi/message.service';

@Component({
  selector: 'app-profilo',
  templateUrl: './profilo.component.html',
  styleUrls: ['./profilo.component.css']
})
export class ProfiloComponent {
  immagineProfilo: any;
  profileSession: any;
  username: any;
  ultimoOrdine : any
  isLoading = false
  constructor(
    public servizioMenu: MenuService,
    private supabaseService: SupabaseService,
    private router: Router,
    private MessageService: MessageService,
  ) {
    this.getProfilePic();
    this.setProfileData();
    this.supabaseService.checkAuth();
  }

async ngOnInit(){
  this.ultimoOrdine = await this.supabaseService.getLastOrder(await this.supabaseService.getUserId());
  console.log("ultimoOrdine : ",this.ultimoOrdine);
  

}

async duplicaOrdine() {
  console.log("onssubmit");
  console.log("ultimoOrdine : ",this.ultimoOrdine);
  
  let paramJson = JSON.parse(JSON.stringify(this.ultimoOrdine));
  paramJson.counter = paramJson.numerordine;
  delete paramJson.numerordine;

  this.isLoading = true;

  this.supabaseService.insertOrdine(paramJson)
    .then((data) => {

      console.log("data : ",data);

      if(data.success){
        console.log("Inserimento riuscito");
        console.log("Animazione:");

        this.MessageService.showMessageSuccess('','Ordine inserito correttamente!')

        this.router.navigate(['/ordini']);
      } else{
        console.error(data.description)
        this.isLoading = false;
        this.MessageService.showMessageWarning('Attenzione',data.description)

      }
      
    })
    .catch((error) => {
      this.isLoading = false;
      this.MessageService.showMessageError('Errore',error)
      console.error("Errore durante l'inserimento:", error);
    });
}


  async getProfilePic() {
    this.immagineProfilo = await this.supabaseService.getProfilePic() + `?timestamp=${new Date().getTime()}`;
  }

  async setProfileData() {
    let sessionData = await this.supabaseService.getSession();
    this.profileSession = sessionData.session?.user;
    this.username = sessionData.session?.user.user_metadata['username'];
  }

  async onFileSelected(event: any) {
    console.log("onFileSelected");
    
    const avatarFile = event.target.files[0]
    console.log(typeof avatarFile);

    if (avatarFile) {
      let username = await this.supabaseService.getUserName()
      await this.supabaseService.deleteImmage("avatars", username + '.jpg')
      await this.supabaseService.insertProfileImage('avatars', avatarFile)
      this.setProfileData();
      this.getProfilePic(); // Aggiungi questo per aggiornare l'URL dell'immagine
      this.MessageService.showMessageSuccess('','Immagine profilo modificata con successo')
    }
  }


  getImages(bucket : string, nomeImmagine : string){
    return this.supabaseService.getImages(bucket,nomeImmagine)
  }
}
