import { Injectable } from '@angular/core';
import { AuthChangeEvent, createClient, Session, SupabaseClient, User, PostgrestResponse } from '@supabase/supabase-js';
import { HttpClient } from '@angular/common/http';
//import { EnvironmentService } from '../environment/environment.service';
import { Router } from '@angular/router';
import { MessageService } from './message.service';
import { DatasetController, LogarithmicScale } from 'chart.js';
import { EnvironmentService } from './environment.service';
import { BehaviorSubject } from 'rxjs';



@Injectable({
  providedIn: 'root'
})




//    Configurazione DB Supabase
export class SupabaseService {
  private supabaseUrl = this.EnvironmentService.getSupabaseUrl()
  private supabaseKey = this.EnvironmentService.getSupabaseKey()
  private supabase = createClient(this.supabaseUrl, this.supabaseKey);


  private storageURL = this.setStorageURL();

  private isThisUserLogged : boolean = false

  /* QUANDO VIENE FATTO IL LOGIN BISOGNA RICARICARE LA NAVBAR */ 
  private eventoSubject = new BehaviorSubject<any>(null);
  eventoLogin$ = this.eventoSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private MessageService: MessageService,
    private EnvironmentService: EnvironmentService,
    ) {

   }






  /*=====================================*/ 
  /*============  BEHAVIOUR  ============*/
  /*=====================================*/ 

  eventoLogin(dato: any) {
    this.eventoSubject.next(dato);
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
            role: 3,
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
  console.log("Accesso Confermato");
  

}


async checkIfUserAuth() {
  const isUserLoggedIn = await this.isUserLogged();
  if (!isUserLoggedIn) {
    this.router.navigate(['/login']);
    // L'utente è loggato, puoi gestire l'accesso alla pagina
  } 
   // L'utente non è loggato, reindirizzalo alla pagina di login
}


async restorePasswordRedirect(paramJson : any){
 
  //var redirectURL = 'http://localhost:4200'
  var redirectURL = 'https://sushiban.vercel.app'

  const { data, error } = await this.supabase.auth.resetPasswordForEmail(paramJson.email, {
    redirectTo: redirectURL + '/ResetPassword/Password',
  })
  if(error){
    return { success: false, description: error.message };
  }
  return { success: true, description: data };


}


async restorePasswordUpdate(paramJson: any) {
  
  const { data, error } = await this.supabase.auth.updateUser({ password: paramJson.Password })

  if(error){
    return { success: false, description: error.message };
  }
  return { success: true, description: data };

}




  /*====================================*/ 
  /*=============  QUERY  =============*/
  /*===================================*/ 

async getPiatti(){
  console.log("getPiatti");
  
  let menu = [{}]
  await this.getSession();
  let idutente = await this.getUserId()
  console.log("idutente : ",idutente);
  
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

  async deleteOrderRapido(idOrdineRapido : string){
    let orderId = await (await this.getLastOrdineId(await this.getUserId())).idOrdine

    
    const { data: deleteData1, error: deleteError1 } = await this.supabase
    .from('PiattiOrdineRapido')
    .delete()
    .eq("idOrdine",idOrdineRapido)

    
    const { data: deleteData2, error: deleteError2 } = await this.supabase
    .from('OrdiniRapidi')
    .delete()
    .eq("id",idOrdineRapido)
  }

    

  async salvataggioOrdine(paramJson: any){
    console.log(paramJson);
    try{
      if(paramJson.length == 0){
        console.error("Impossibile inserire un ordine vuoto",);
        return { success: false, description: "Inserisci almeno un piatto per poter salvare un ordine" };
      }

      let UserId = await this.getUserId();

      const { data: insertData, error: insertError } = await this.supabase
        .from('OrdiniRapidi')
        .insert({ idutente: UserId });

        if (insertError) {
          console.error("Si è verificato un errore durante l'inserimento:", insertError);
          return { success: false, description: insertError.message };
        }


        const { data: selectData, error: selectError } = await this.supabase
        .from('OrdiniRapidi')
        .select("id")
        .eq("idutente",UserId)
        .order('id', { ascending: false, nullsFirst: false })
        .limit(1);



        if (selectError) {
          console.error("Si è verificato un errore durante l'inserimento:", insertError);
          return { success: false, description: selectError.message };
        }
        
        let idOrdine = selectData[0].id;


        for (const piatto of paramJson) {
          // Prendi l'id di ogni piatto
          const { idPiatto, selectError } = await this.getidPiattoFromCodice(piatto.codice); // Chiamata asincrona
  
          if (selectError) {
            console.error("Si è verificato un errore durante l'inserimento:", selectError);
            return { success: false, description: selectError.message };
          } 

          let numeroPiatti = piatto.counter != null || piatto.counter != undefined ? piatto.counter : piatto.numeropiatti

          const { data: ordineData, error: insertError } = await this.supabase
            .from('PiattiOrdineRapido')
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

  setStorageURL(){
    return this.EnvironmentService.getSupabaseUrl() + '/storage/v1/object/public/'
  }

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
  


  getPictureURL(bucket : string, nome: string){
      const randomParam = Math.random(); // Genera un parametro casuale
      return `${this.storageURL}/${bucket}/${nome}.jpg`;
    
    
    //return this.storageURL + '/' + bucket + '/' + nome + '.jpg' //+ `?timestamp=${new Date().getTime()}`
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

    //Ritorna l'id del piatto partendo dal codice del piatto(es A1, B9...)
  async getDescrizionePiattoFromId(idPiatto:String){
      const { data: piattoData, error: selectError } = await this.supabase
      .from('Piatti')
      .select('descrizione')
      .eq('id', idPiatto) 
    
      if (piattoData && piattoData.length > 0) {
        const descrizione = piattoData[0].descrizione;
        return { descrizione, selectError};
      } else {
        // Gestisci il caso in cui piattoData sia nullo o vuoto
        return { descrizione: null, selectError };
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

  async getUserRole(userId : String){
    const { data: selectData, error: selectError } = await this.supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)

    if(!selectError){
      return selectData[0].role
    }
    return -1

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
    
    return data
  }


  async getOrdiniRapidi(){
    let oggettoOrdineRapido: any = []
    let idUtente = await this.getUserId();

    const { data, error } = await this.supabase
    .from('OrdiniRapidi')
    .select('id')
    .eq('idutente', idUtente) 

    if(error){ return [{}] }    

    for (const ordineRapido of data) {
      let idOrdine = ordineRapido.id
      
      const { data, error } = await this.supabase.rpc('getordinerapido', { idordineparam: idOrdine })
      if(error){ return [{}] }
      oggettoOrdineRapido.push({idOrdine,data})

    };


    return oggettoOrdineRapido

  }
  
  
  isValidEmail(email: string): boolean {
    // Utilizza una regex per controllare se la stringa è un formato email valido
    console.log(email);
    
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
    }
  
  
  getMessageError(descErrore: any) {
    console.error("ERRORE : ",+descErrore)
    
    if (descErrore.includes('Password should be at least 6 characters')) return "La password deve avere almeno 6 caratteri";
    else if (descErrore.includes('Unable to validate email address: invalid format'))  return "Email non valida.";
    else if (descErrore.includes('User already registered')) return "Questo utente è già registrato.";
    else if (descErrore.includes('duplicate key value violates unique constraint "profiles_username_key"'))  return "Esiste già un utente con questo Username.";
    else if (descErrore.includes('Email rate limit exceeded'))  return "Troppe richieste in arrivo: riprova tra un po'.";
    else if (descErrore.includes('insert or update on table "profiles" violates foreign key constraint "profiles_id_fkey"')) return "Esiste già un profilo connesso con questa email";
    else if (descErrore.includes('For security purposes, you can only request this once every 60 seconds')) return "Per motivi di sicurezza puoi mandare una richiesta ogni 60 secondi";
    else if (descErrore.includes('duplicate key value violates unique constraint "profiles_username_key')) return "Esiste già un profilo connesso con questa email";
    
    
    else return "Errore: " + descErrore;
    
  }
  
}

