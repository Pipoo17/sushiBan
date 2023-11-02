import { Injectable } from '@angular/core';
import { createClient, PostgrestResponse } from '@supabase/supabase-js';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
//    Configurazione DB Supabase
export class SupabaseService {
  private supabaseUrl = 'https://lcitxbybmixksqmlyyzb.supabase.co';
  private supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjaXR4YnlibWl4a3NxbWx5eXpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTczMDA0MTksImV4cCI6MjAxMjg3NjQxOX0.Gr20DaBG56cYTTuPF_pceqvA8lpiG4D-bizhqBRDf2o';
  private supabase = createClient(this.supabaseUrl, this.supabaseKey);
  


  private urlImgNotFound = "https://lcitxbybmixksqmlyyzb.supabase.co/storage/v1/object/public/immaginiPiatti/default.jpg.jpg"
  constructor(private http: HttpClient) { }


  //  Chiaamta alle Stored Procedure sul db Supabase (per elenco guardare evernote)
  async callStoredProcedure<T>(procedureName: string): Promise<T> {
    // Chiamata alla procedura memorizzata senza parametri
    const { data, error } = await this.supabase.rpc(procedureName);

    if (error) {
      console.error('Errore durante la chiamata alla procedura:', error);
      throw error;
    }

    return data;
  }
    
    
  async getImmagineUrlFromName(nomeContainerSupabase: string, nomePiatto: string, ): Promise<string> {
    // Utilizza la funzione getPublicUrl per ottenere l'URL pubblico dell'immagine.
    const response = await this.supabase.storage.from(nomeContainerSupabase).getPublicUrl(`${nomePiatto}.jpg`);

    try {
      const imageUrl = response.data.publicUrl;
      return imageUrl;
    } catch (error) {
      // Se si verifica un errore, restituisci l'URL statico impostato.
      return this.urlImgNotFound;
    }
  }


  //SELECT IDPIATTO
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


  //Inserimento ordini
  async insertOrdine(paramJson: any) {
    console.log("chiamata insertOrdine ");
    console.log("body: ", paramJson);
  
    for (const piatto of paramJson) {
      //prendo l'id del piatto 
      const { idPiatto, selectError } = await this.getidPiattoFromCodice(piatto.codice); // Chiamata asincrona


      if (selectError && idPiatto != null) {
        console.error("Si è verificato un errore durante la select:", selectError);
      } else {
        console.log("piattoData : ",idPiatto )
        
        
        const { data: ordineData, error: insertError } = await this.supabase
          .from('Ordini')
          .insert({idUtente: null, dataOrdine: this.getData()});
    
        if (insertError) {
          console.error("Si è verificato un errore durante l'inserimento:", insertError);
        } else {
          console.log("Inserimento riuscito:", ordineData);
/*
          // Ora, visualizza l'animazione quando l'inserimento ha successo
          const lottiePlayer = document.createElement('lottie-player');
          lottiePlayer.src = "https://lottie.host/50d7ee4d-877e-4d4a-a76d-145402927cf9/tyE4GqV01f.json";
          lottiePlayer.style.width = "300px";
          lottiePlayer.style.height = "300px";
          lottiePlayer.loop = true;
          lottiePlayer.autoplay = true;
          lottiePlayer.direction = 1;
          lottiePlayer.mode = "normal";
  
          // Aggiungi l'elemento lottiePlayer al tuo documento HTML
          document.body.appendChild(lottiePlayer);
          */
         
        }
        
      }
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
  
}
