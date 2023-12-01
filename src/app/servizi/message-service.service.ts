import { Injectable } from '@angular/core';
import { Message } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class MessageServiceService {

  constructor() { 


  }
  message: Message[] = [];


  showWarningMessage(Header: string, testo: string){

    this.message = [
      {
        severity: 'warn',
        summary: Header,
        detail: testo
      }
    ];

  }

}
