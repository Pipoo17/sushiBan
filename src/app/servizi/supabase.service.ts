import { Injectable } from '@angular/core';
import { AuthChangeEvent, createClient, Session, SupabaseClient, User, PostgrestResponse } from '@supabase/supabase-js';
import { HttpClient } from '@angular/common/http';
import { OrdineSuccesComponent } from '../animazioni/ordine-succes/ordine-succes.component';
import { EnvironmentService } from '../environment/environment.service';
import { Router } from '@angular/router';
import { MessageService } from './message.service';
import { DatasetController, LogarithmicScale } from 'chart.js';



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
  
  private isThisUserLogged : boolean = false

  private urlImgNotFound = "https://lcitxbybmixksqmlyyzb.supabase.co/storage/v1/object/public/immaginiPiatti/default.jpg.jpg"
  constructor(
    private http: HttpClient,
    private router: Router,
    private MessageService: MessageService,
    ) {

   }






  /*====================================*/ 
  /*=========  AUTHENTICATION  =========*/
  /*====================================*/ 


  async register(paramJson: any) {
    console.log('paramJson : ',paramJson)
    try {
      //controllo che l'user name non sia gia stato usato
      let isUsernameFree = await this.isUsernameFree(paramJson.username)
      
      if (!isUsernameFree){
        return { success: false, description: 'duplicate key value violates unique constraint "profiles_username_key' };
      }

      const { data, error } = await this.supabase.auth.signUp({
        email: paramJson.email,
        password: paramJson.password,
        options: {
          data: {
            username: paramJson.username,
          },
        },
      });
  
      if (error) {
        return { success: false, description: error.message };
      }
  
      if (data && data.user != null) {
        const userId = data.user.id;
  
      const { data: ordineData, error: insertError } = await this.supabase
        .from('profiles')
        .upsert([
          {
            id: userId,
            username: paramJson.username,
            avatar_url: paramJson.username + ".jpg",
          },
        ]);
//todo : aguardare se l'immagine viene caricata correttamente quando si crea un profilo
        this.copyImage(paramJson.username);
  
       if (insertError) {
         return { success: false, description: insertError.message };
       }
     }
     //commit
     return { success: true, description: 'Registrazione avvenuta con successo' };
   } catch (err) {
     return { success: false, description: err };
   }
  }
  




async login(paramJson : any){
  const { data, error } = await this.supabase.auth.signInWithPassword({
    email: paramJson.email,
    password: paramJson.password,
  })

  if (error){
    return { success: false, description: error.message };
  }
  return { success: true, description: 'Accesso avvenuto con successo' };

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

async checkAuth(){
  this.checkIfUserAuth();
  this.setUserLogged(true)
}

//TODO : QUANDO IL FRONTAND SI RESETTA A CAUSA DI ANGULAR (IL CODICE VIENE MODIFICATO)
//       NON VIENNE MOSTRATA LA BARRA LATERALE
async checkIfUserAuth() {
  const isUserLoggedIn = await this.isUserLogged();
  if (!isUserLoggedIn) {
    this.router.navigate(['/login']);
    // L'utente è loggato, puoi gestire l'accesso alla pagina
  } 
   // L'utente non è loggato, reindirizzalo alla pagina di login
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

async getPiatti(){
  console.log("getPiatti");
  
  let menu = [{}]
  await this.getSession();
  let idutente = await this.getUserId()

  const { data, error } = await this.supabase.rpc('getpiatti', { idutente: idutente })
  if(error){ return [{}] }
  return data

}



  async addPreferiti(idPiatto : string){
    let UserId = await this.getUserId() + '';

    const { data: ordineData, error: insertError } = await this.supabase
    .from('Preferiti')
    .insert({ idUtente: UserId, idPiatto: idPiatto });

    if(!insertError){
      return { success: true, description: "Piatto aggiunto ai preferiti" };
    }    
    return { success: false, description: insertError.message };
  }

  async removePreferiti(idPiatto : string){
    let UserId = await this.getUserId() + '';

    const { data: ordineData, error: insertError } = await this.supabase
    .from('Preferiti')
    .delete()
    .eq('idUtente', UserId)
    .eq('idPiatto', idPiatto)

    if(!insertError){
      return { success: true, description: "Piatto rimosso dai preferiti" };
    }
    
    return { success: false, description: insertError.message };
  }

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
  //TODO : RIFARE METODO
  async insertOrdine(paramJson: any){
    console.log(paramJson);
    
    try {
      
      if(paramJson.length == 0){
        console.error("Impossibile inserire un ordine vuoto",);
        return { success: false, description: "Inserisci almeno un piatto per poter fare un ordine" };
      }

      //controllo che sia il primo ordine
      if (!await this.isFirstOrder()) {
        console.error("Si è verificato un errore durante l'inserimento: E' possibile fare solo un ordine a persona",);
        return { success: false, description: "E' possibile fare solo un ordine a persona" };
      }

      let UserId = await this.getUserId() + '';

      const { data: ordineData, error: insertError } = await this.supabase
        .from('Ordini')
        .insert({ idutente: UserId, dataOrdine: this.getData() });
  
      if (insertError) {
            console.error("Si è verificato un errore durante l'inserimento:", insertError);
            return { success: false, description: insertError.message };
      } 

      const { idOrdine, selectError } = await this.getLastOrdineId(UserId); 
      if(selectError){
        return { success: false, description: selectError.message };
      }
      

      for (const piatto of paramJson) {
        // Prendi l'id di ogni piatto
        const { idPiatto, selectError } = await this.getidPiattoFromCodice(piatto.codice); // Chiamata asincrona

        if (selectError) {
            console.error("Si è verificato un errore durante l'inserimento:", selectError);
            this.rollBackOrdine(idOrdine);
            return { success: false, description: selectError.message };
        } else {
          let numeroPiatti = piatto.counter != null || piatto.counter != undefined ? piatto.counter : piatto.numeropiatti
          const { data: ordineData, error: insertError } = await this.supabase
            .from('PiattiOrdine')
            .insert({ 
              idOrdine: idOrdine, 
              idPiatto: idPiatto, 
              numeroPiatti: numeroPiatti });

          if (insertError) {
            console.error("Si è verificato un errore durante l'inserimento:", insertError);
            this.rollBackOrdine(idOrdine);
            return { success: false, description: insertError.message };
          }
        }
      }

      return { success: true, description: 'Inserimento Completato' };
    
    } catch (error) {
      console.error("Si è verificato un errore durante l'inserimento:", error);
      //return { success: false, description: error };    }
      return { success: false, description: "Si è verificato un errore durante l'inserimento" };    }
  }
  

  async rollBackOrdine(idOrdine : string){
    console.log("idOrdine : ",idOrdine)
    const { data: dataPiatti, error: errorPiatti } = await this.supabase
      .from('PiattiOrdine')
      .delete()
      .eq( 'idOrdine', idOrdine );

    const { data, error } = await this.supabase
      .from('Ordini')
      .delete()
      .eq('idOrdine', idOrdine);

      console.log('dataPiatti : ',dataPiatti)
      console.log('errorPiatti : ',errorPiatti)
      console.log('data : ',data)
      console.log('error : ',error)

      if(!error && !errorPiatti){
        console.error("ERRORE GESTITO : Ordine eliminato")
      }else{
        console.error("ERRORE NON GESTITO : Ordine non eliminato!!")

      }
    }



    async getThisUserOrder(idUtente : string){
      
      let idOrdine = await this.getLastOrdineId(idUtente)
      
      /*
      
        Codice -1 : Ordine non esistente
        Codice -2 : Errore select ordice

      */ 


      if(idOrdine.idOrdine == -1) {return []}
      if(idOrdine.idOrdine == -2) {return [{idPiatto : 'error',numeroPiatti:idOrdine.selectError?.message}]}

      const { data: selectData, error: selectError } = await this.supabase
      .from('PiattiOrdine')
      .select('idPiatto,numeroPiatti')
      .eq('idOrdine', idOrdine.idOrdine) 
      
      if(selectError){
        return [{idPiatto : 'error',numeroPiatti:"Errore nella visualizzazione dell'ordine : ",selectError}]
      }
    return selectData
    }


    async getAllUsersOrder(){
      let orders = await this.callStoredProcedure("getallusersorders");
      return orders;
      


    }


    async deleteOrder(){
      let orderId = await (await this.getLastOrdineId(await this.getUserId())).idOrdine
      console.log(orderId);
      
      const { data: deleteData1, error: deleteError1 } = await this.supabase
      .from('PiattiOrdine')
      .delete()
      .eq("idOrdine",orderId)

      
      const { data: deleteData2, error: deleteError2 } = await this.supabase
      .from('Ordini')
      .delete()
      .eq("idOrdine",orderId)
    }


    async salvataggioOrdine(paramJson: any){
      console.log(paramJson);
      try{
        if(paramJson.length == 0){
          console.error("Impossibile inserire un ordine vuoto",);
          return { success: false, description: "Inserisci almeno un piatto per poter salvare un ordine" };
        }


        return { success: true, description: 'Salvataggio Completato' };
      }catch(error){
        console.error("ERRORE : ",error);
        return { success: false, description: error };
        

      }


    }

    

  /*============================================*/ 
  /*==========  METODI PER I GRAFICI  ==========*/
  /*============================================*/ 
  //classifica degli utenti che hanno ordinato maggiormente  
  async getUserMostActive(){
    let classifica : any = await this.callStoredProcedure("classificaordiniperutente");
    return classifica;

    }

    async getMostOrderedDishes(){
    let classifica : any = await this.callStoredProcedure("mostordereddishes");
    return classifica;

    }



  /*====================================*/ 
  /*==========  METODI UTILS  ==========*/
  /*====================================*/ 

  async isFirstOrder() {
    try {

      const userId = await this.getUserId();
      if (!userId) {
        console.error('UserId non disponibile.');
        return;
      }
  
      const { data: countData, error: countError } = await this.supabase
        .from('Ordini')
        .select('*', { count: 'exact' })
        .eq('dataOrdine', this.getData())
        .eq('idutente', userId.trim());
  
      if (countError) {
        console.error(countError.message);
        return; // Gestisci l'errore come desideri
      }
  
      let numeroOrdini = countData.length;
      if(numeroOrdini == 0 ){ return true }
      return false



    } catch (error) {
      console.error(error);
      return
      // Gestisci l'errore come desideri
    }
  }
  
  

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



  async isUsernameFree(username: string) {
    const { data: imageData, error: selectError } = await this.supabase
      .from('profiles')
      .select('username', { count: 'exact' })
      .eq('username', username);
    if (selectError) {
      // Gestisci l'errore qui
      console.error('Errore nella query:', selectError);
      return -1; // O un'altra gestione dell'errore
    }
  
    const count = imageData.length; // Ottieni il conteggio dal risultato della query
    if (count > 0) return false
    return true 

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

    //Ritorna l'id del piatto partendo dal codice del piatto(es A1, B9...)
    async getCodicePiattoFromId(idPiatto:String){
      const { data: piattoData, error: selectError } = await this.supabase
      .from('Piatti')
      .select('codice')
      .eq('id', idPiatto) 
    
      if (piattoData && piattoData.length > 0) {
        const idPiatto = piattoData[0].codice;
        return { idPiatto, selectError};
      } else {
        // Gestisci il caso in cui piattoData sia nullo o vuoto
        return { idPiatto: null, selectError };
      }
    }

    //Ritorna l'id dell'ultimo ordine inserito
    async getLastOrdineId(idUtente : string){
      
      const { data: selectData, error: selectError } = await this.supabase
      .from('Ordini')
      .select('idOrdine')
      .eq('idutente', idUtente)
      .eq('dataOrdine', this.getData())


      if(selectData?.length == 0) {
        return { idOrdine: -1, selectError };
      }
      if(selectError){
        return { idOrdine: -2, selectError };
      }
      const idOrdine = selectData[0].idOrdine;  
      
      return { idOrdine, selectError};
      


    }

  async getQuantiClienti(){
    const { data: selectData, error: selectError } = await this.supabase
    .from('Ordini')
    .select('idOrdine')
    .eq("dataOrdine",this.getData())
    
    return selectData?.length;

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

  async getUserId(){
    let  dataSession = await this.getSession();
    return dataSession.session?.user.id + ''
  }
  async getUserName(){
    let  dataSession = await this.getSession();
    return dataSession.session?.user.user_metadata['username'] + ''
  }

  setUserLogged(isLogged : boolean){
    this.isThisUserLogged = isLogged;
  }
  
  getUserLogged(){
    return this.isThisUserLogged
  }
  
 async uploadImage(bucket : string,imageName : string, imageFile : any){

  const { data, error } = await this.supabase
    .storage
    .from(bucket)
    .upload(imageName +'.png', imageFile, {
      cacheControl: '3600',
      upsert: false
    })

  }

  async deleteImmage(bucket : string, imageName : string){

    const { data : deleteData, error: errorData } = await this.supabase
    .storage
    .from(bucket)
    .remove([imageName])

    console.log("immagine eliminata : ", imageName);
    
    console.log("deleteData : ",deleteData);
    console.log("errorData : ",errorData);
    
  }

  async insertProfileImage(bucket : string, imageFile : any){
    let username = await this.getUserName()
    const { data, error } = await this.supabase
      .storage
      .from(bucket)
      .upload(username+'.jpg', imageFile, {
        cacheControl: '3600',
        upsert: false
      })
  
     const { data: ordineData, error: insertError } = await this.supabase
           .from('profiles')
           .update([{avatar_url: username+'.jpg'}])
           .eq('username', username)
           .select()
    
      
  }

  async copyImage(username : string){
    
  const { data, error } = await this.supabase
  .storage
  .from('avatars')
  .copy('Empty.jpg', username + '.jpg')
  }


  async getLastOrder(idUtente : string){

    const { data, error } = await this.supabase.rpc('getlastorder', { idutenteparam: idUtente })
    if(error){ return [{}] }
    console.log("data : ",data);
    
    return data
  }
  getImages(bucket : string, nomeImmagine : string){
    return `https://lcitxbybmixksqmlyyzb.supabase.co/storage/v1/object/public/${bucket}/${nomeImmagine}.jpg`;
  }

}

