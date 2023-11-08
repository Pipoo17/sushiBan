import { Injectable } from '@angular/core';
import { AuthChangeEvent, createClient, Session, SupabaseClient, User, PostgrestResponse } from '@supabase/supabase-js';
import { HttpClient } from '@angular/common/http';
import { OrdineSuccesComponent } from '../animazioni/ordine-succes/ordine-succes.component';
import { EnvironmentService } from '../environment/environment.service';





export interface IUser {
  email: string;
  name: string;
  website: string;
  url: string;
}


@Injectable({
  providedIn: 'root'
})







//    Configurazione DB Supabase
export class SupabaseService {
  //private supabase = this.EnvironmentService.getSupabaseParams
  private supabaseUrl = 'https://lcitxbybmixksqmlyyzb.supabase.co';
  private supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjaXR4YnlibWl4a3NxbWx5eXpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTczMDA0MTksImV4cCI6MjAxMjg3NjQxOX0.Gr20DaBG56cYTTuPF_pceqvA8lpiG4D-bizhqBRDf2o';
  private supabase = createClient(this.supabaseUrl, this.supabaseKey);
  
  private sessionData : any;


  private urlImgNotFound = "https://lcitxbybmixksqmlyyzb.supabase.co/storage/v1/object/public/immaginiPiatti/default.jpg.jpg"
  constructor(private http: HttpClient) {

   }






  /*====================================*/ 
  /*=========  AUTHENTICATION  =========*/
  /*====================================*/ 


async register(paramJson : any){
  console.log(paramJson)

  const { data, error } = await this.supabase.auth.signUp({
    email: paramJson.email,
    password: paramJson.password,
    options: {
     data: {
       username: paramJson.username,
     }
   }
  })

  if (data.user != null) {

    const userId = data.user.id;
    // L'operazione upsert aggiornerà il record se esiste già con lo stesso ID, altrimenti ne creerà uno nuovo.
    // Aggiorno i campi username e avatarURL dove l'id è quello dell'utente appena creato
    const { data: ordineData, error: insertError } = await this.supabase
      .from('profiles')
      .upsert([
        {
          id: userId,
          username: paramJson.username,
          avatar_url: "Empty.jpg",
        },
      ]);

    
  }
}


async login(paramJson : any){
  const { data, error } = await this.supabase.auth.signInWithPassword({
    email: paramJson.email,
    password: paramJson.password,
  })
  this.getSession()
}


async logout(){
  const { error } = await this.supabase.auth.signOut()
  this.getSession()
} 


async getSession(){
  const {data: dataSession, error : errorSession } = await this.supabase.auth.getSession()
  console.log("dataSession : ",dataSession)
  return dataSession
  
}


async restorePassword(paramJson : any){
 // TODO
 // const { data, error } = await this.supabase.auth.resetPasswordForEmail(paramJson.email, {
 //   redirectTo: 'https://example.com/update-password',
 // })
}




  /*====================================*/ 
  /*=============  QUERY  =============*/
  /*===================================*/ 


  //  Chiamata alle Stored Procedure sul db Supabase (per elenco guardare evernote)
  async callStoredProcedure<T>(procedureName: string): Promise<T> {
    // Chiamata alla procedura memorizzata senza parametri
    const { data, error } = await this.supabase.rpc(procedureName);

    if (error) {
      console.error('Errore durante la chiamata alla procedura:', error);
      throw error;
    }

    return data;
  }
    

  //Inserimento ordini
  async insertOrdine(paramJson: any): Promise<boolean> {
    try {
      // Creazione dell'ordine
      const { data: ordineData, error: insertError } = await this.supabase
        .from('Ordini')
        .insert({ idUtente: null, dataOrdine: this.getData() });
  
      if (insertError) {
        console.error("Si è verificato un errore durante l'inserimento:", insertError);
        return false; // Restituisci false in caso di errore
      } else {
        let inserimentoRiuscito = true; // Inizializziamo a true
  
        for (const piatto of paramJson) {
          // Prendi l'id di ogni piatto
          const { idPiatto, selectError } = await this.getidPiattoFromCodice(piatto.codice); // Chiamata asincrona
  
          if (selectError && idPiatto != null) {
            console.error("Si è verificato un errore durante la select:", selectError);
            inserimentoRiuscito = false; // Impostiamo a false in caso di errore
            break; // Esci dal ciclo
          } else {
            const { idOrdine, selectError } = await this.getLastOrdine(); // Chiamata asincrona
  
            const { data: ordineData, error: insertError } = await this.supabase
              .from('PiattiOrdine')
              .insert({ idOrdine: idOrdine, idPiatto: idPiatto, numeroPiatti: piatto.counter });
  
            if (insertError) {
              console.error("Si è verificato un errore durante l'inserimento:", insertError);
              inserimentoRiuscito = false; // Impostiamo a false in caso di errore
              break; // Esci dal ciclo
            }
          }
        }
  
        if (inserimentoRiuscito) { return true } 
        return false; // Restituisci false in caso di errore
      }
    } catch (error) {
      console.error("Si è verificato un errore durante l'inserimento:", error);
      return false; // Restituisci false in caso di errore
    }
  }
  



  /*====================================*/ 
  /*==========  METODI UTILS  ==========*/
  /*====================================*/ 

  //Genera l'url delle immagini partendo dal codice del piatto(es A1, B9...)
  async getImmagineUrlFromName(nomeContainerSupabase: string, nome: string, ): Promise<string> {
    // Utilizza la funzione getPublicUrl per ottenere l'URL pubblico dell'immagine.
    const response = await this.supabase.storage.from(nomeContainerSupabase).getPublicUrl(`${nome}.jpg`);

    try {
      const imageUrl = response.data.publicUrl;
      return imageUrl;
    } catch (error) {
      // Se si verifica un errore, restituisci l'URL statico impostato.
      return this.urlImgNotFound;
    }
  }


  async getProfilePic() {
   let data = await this.getSession()
   let idUtente = data.session?.user.id
   if (idUtente) {
     let picName = await this.getProfilePicName(idUtente);
     let URL = await this.supabase.storage.from('avatars').getPublicUrl(picName);
     return URL.data.publicUrl
   } else {
     //immagine standard
    return "https://lcitxbybmixksqmlyyzb.supabase.co/storage/v1/object/public/avatars/Empty.jpg"
  }


}

  async getProfilePicName(idUtente : string){
    const { data: imageData, error: selectError } = await this.supabase
    .from('profiles')
    .select('avatar_url')
    .eq('id', idUtente) 
    if(imageData != null){
      return imageData[0].avatar_url
    }
      return "Error.jpg"
  }


    //Ritorna l'id del piatto partendo dal codice del piatto(es A1, B9...)
    async getidPiattoFromCodice(codicePiatto:String){
      const { data: piattoData, error: selectError } = await this.supabase
      .from('Piatti')
      .select('id')
      .eq('codice', codicePiatto) 
    
      if (piattoData && piattoData.length > 0) {
        const idPiatto = piattoData[0].id;
        return { idPiatto, selectError};
      } else {
        // Gestisci il caso in cui piattoData sia nullo o vuoto
        return { idPiatto: null, selectError };
      }
    }

    //Ritorna l'id dell'ultimo ordine inserito
    async getLastOrdine(){
      const { data: ordineData, error: selectError } = await this.supabase
      .from('Ordini')
      .select('idOrdine')
      .order('idOrdine', { ascending: false })
      .limit(1);
    
      if (ordineData && ordineData.length > 0) {
        const idOrdine = ordineData[0].idOrdine;
        return { idOrdine, selectError};
      } else {
        // Gestisci il caso in cui piattoData sia nullo o vuoto
        return { idOrdine: null, selectError };
      }
    }

    //return data
  private getData(): string {
    const oggi = new Date();
    const anno = oggi.getFullYear().toString();
    const mese = (oggi.getMonth() + 1).toString().padStart(2, '0'); // Mese inizia da 0
    const giorno = oggi.getDate().toString().padStart(2, '0');
  
    return anno + mese + giorno;
  }

  async isUserLogged(): Promise<boolean> {
    //const { data: dataSession, error: errorSession } = await this.supabase.auth.getSession();
    let  dataSession = await this.getSession();
    if(dataSession.session == null ) { return false } 
    return true;
  }

  
  
}
