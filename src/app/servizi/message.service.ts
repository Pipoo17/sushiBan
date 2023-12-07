import { Injectable } from '@angular/core';
import { Message } from 'primeng/api';


@Injectable({
  providedIn: 'root'
})
export class MessageService {
  infoMessages: Message[] = [];
  successMessages: Message[] = [];
  warningMessages: Message[] = [];
  errorMessages: Message[] = [];

  //timeout per la chiusura dei messaggi 
  defaultTimeout = 10000;
  longTimeout = 20000;

  constructor() { }


  showMessageInfo(header : string, message : string){
    this.infoMessages = [{
      severity: 'info',
      summary: header,
      detail: message
      }
    ]
    
    this.hideMessage(this.longTimeout);
  }
  
  showMessageSuccess(header : string, message : string){    
    this.successMessages = [{
      severity: 'success',
      summary: header,
      detail: message
      }
    ]

    this.hideMessage(this.defaultTimeout);
  }

  showMessageWarning(header : string, message : string){    
    this.warningMessages = [{
      severity: 'warn',
      summary: header,
      detail: message
      }
    ]

    this.hideMessage(this.defaultTimeout)
  }
  
  showMessageError(header : string, message : string){    
    this.errorMessages = [{
      severity: 'error',
      summary: header,
      detail: message
      }
    ]

    this.hideMessage(this.defaultTimeout);
  }


  deleteMessage(){
    this.infoMessages = []
    this.successMessages = []
    this.warningMessages = []
    this.errorMessages = []
  }

  private hideMessage(delay : number) {
    setTimeout(() => {
      this.infoMessages = []
      this.successMessages = []
      this.warningMessages = []
      this.errorMessages = []
    }, delay);
  }



}
