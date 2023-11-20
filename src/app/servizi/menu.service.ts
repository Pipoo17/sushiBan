import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Data } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { User } from '../modelli/user.model';
import { SupabaseService } from 'src/app/servizi/supabase.service';



@Injectable({
  providedIn: 'root'
})
export class MenuService {
//urlDB
  urlDBOrdini = 'https://sushiban-bb4e6-default-rtdb.firebaseio.com/ordini.json';
  [x: string]: any;
  ApiKey = "AIzaSyCbI_o81OeOlc_PC46Q6wVa96WPXNSImDQ"
  urlRegister ="https://identitytoolkit.googleapis.com/v1/accounts:signUp?key="+this.ApiKey;
  urlLogin ="https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key="+this.ApiKey;
  
  categorie: string[] = [];
  nPiatti = 0;
  maxPiatti = 5;
  counterPref = 0;
  isLogged=true;
  isAdmin=true;
  user!: User; 

  menu = this.riempiMenu();



  constructor(
    private snackBar: MatSnackBar, 
    private http:HttpClient,
    private supabaseService: SupabaseService) { }
  
  private menuSubject = new BehaviorSubject<any[]>(this.menu);
  
  menu$ = this.menuSubject.asObservable();



  //  Creazione Menu
  //TODO
  //UNA VOLTA CREATI I PROFILI NEL NUOVO DB IMPLEMENTARE I PREFERITI
  riempiMenu(): any[]{
    this.supabaseService.callStoredProcedure("getpiatti")
      .then(data => {
        if (Array.isArray(data)) {
          data.forEach((piatto: any) => {
            let ImgUrl = this.supabaseService.getImmagineUrlFromName("immaginiPiatti",piatto.codice)
            ImgUrl.then(urlData => {
              this.menu.push({
                codice: piatto.codice,
                nome: piatto.nome,
                categoria: piatto.categoria,
                counter: 0,
                preferito: false,
                img: urlData
              });       
            })
        });
      }
      return this.menu
      })
      .catch(error => {
        console.error('Errore durante l\'esecuzione della query SQL:', error);
      });
    return this.menu = [];
  }


  //Ritorna i piatti che sono stati inseriti nel carrello
  getOrdine(){
    let ordine: any[] = []
    this.menu.forEach((piatto) =>{
      if(piatto.counter > 0){
        ordine.push(piatto)
      }
    })
    return ordine;
  }



  async insertOrdine(body: { counter: number }[]) {
    this.supabaseService.insertOrdine(body)
  }



  hasPreferitiInCategoria(categoria: string): boolean {
    return this.menu.some(piatto => piatto.preferito && piatto.categoria === categoria);
  }



  getQuantiPreferiti(){
    this.counterPref = 0;
    this.menu.forEach((piatto) => {
      if (piatto.preferito == true) {
        this.counterPref++;
      }
    });
  
    return this.counterPref;
  }

  getCategorie() {
    this.menu.forEach((piatto) => {
      if (!this.categorie.includes(piatto.categoria)) {
        this.categorie.push(piatto.categoria);
      }
    });
  
    return this.categorie;
  }
  getCategorieFromIndex(index: number) {
    return this.categorie[index];
  }


   aggiungiPiatto(index: number) {
    if ( this.nPiatti >= 0 && this.nPiatti < this.maxPiatti)  {
      this.menu[index].counter += 1;
      this.menuSubject.next(this.menu); // Emit updated menu
      this.nPiatti += 1;
    }else{
      this.snackBar.open('Non puoi ordinare piu di 5 piatti', 'Close', {
        duration: 2000, // Duration in milliseconds
      });
    }
  }

  rimuoviPiatto(index: number) {
    if (this.nPiatti > 0 && this.menu[index].counter > 0) {
      this.menu[index].counter -= 1;
      this.menuSubject.next(this.menu); // Emit updated menu
      this.nPiatti -= 1;
    }
  } 
  eliminaPiatto(index: number) {
    this.nPiatti -= this.menu[index].counter;
    this.menu[index].counter = 0;
  } 
/*   carrelloVuoto(){
    this.nPiatti = 0;
    for (const piatto of this.menu) {
      if (piatto.counter = 0) this.nPiatti+=1 
    }
    if (this.nPiatti === 0) return true;else return false;
    
  } */
  getCounter(index : number){
    return this.menu[index].counter;
  }
  getCodice(index : number){
    return this.menu[index].codice;
  }
  getNome(index : number){
    return this.menu[index].nome;
  }
  getImg(index : number){
    return this.menu[index].img;
  }
  isAuthenticated(){
    return this.isLogged
  }
  isRoleAdmin(){
    return this.isAdmin
  }

  getQuantiClienti(){
    return this.supabaseService.getQuantiClienti();
  }


  createUser(email: string,id: string,_token: string,_expirationDate: Date){
    this.user = new User(email,id,_token,_expirationDate)
  }

  //  AUTENTICAZIONE // 
  
  //REGISTRAZIONE
  signUp(email:string, password:string){
    return this.http.post(this.urlRegister,{email: email, password:password, returnSecureToken:true})
    
  }

  signIn(email:string, password:string){
    return this.http.post(this.urlLogin,{email: email, password:password, returnSecureToken:true})
  }

  logout(){
    this.isLogged = false
    //this.user = null
    localStorage.removeItem('user')
  }
  
  //TODO : implementare auto login quando il profilo è ancora in sessione

/*
    salvaDatiAggiuntivi(email: string, nome: string, cognome: string) {
      return this.firestore.collection('utenti').doc(email).set({ nome, cognome });
    }
*/
  //  GESTIONE CRUD //


}
