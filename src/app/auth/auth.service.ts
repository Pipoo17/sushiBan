import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLogged = false;

  islogged(){
    return this.isLogged
  }

  constructor() { }
}
