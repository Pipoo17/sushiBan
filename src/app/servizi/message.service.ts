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

  constructor() { }


  showMessageInfo(header : string, message : string){
    this.infoMessages = [{
      severity: 'info',
      summary: header,
      detail: message
      }
    ]
    
    this.hideMessage(3000);
  }
  
  showMessageSuccess(header : string, message : string){    
    this.successMessages = [{
      severity: 'success',
      summary: header,
      detail: message
      }
    ]

    this.hideMessage(3000);
  }

  showMessageWarning(header : string, message : string){    
    this.warningMessages = [{
      severity: 'warn',
      summary: header,
      detail: message
      }
    ]

    this.hideMessage(3000)
  }
  
  showMessageError(header : string, message : string){    
    this.errorMessages = [{
      severity: 'error',
      summary: header,
      detail: message
      }
    ]

    this.hideMessage(3000);
  }
  
  hideMessage(delay : number) {
    setTimeout(() => {
      this.infoMessages = []
      this.successMessages = []
      this.warningMessages = []
      this.errorMessages = []
    }, delay);
  }

}
