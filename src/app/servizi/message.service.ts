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
  }
  
  showMessageSuccess(header : string, message : string){    
    this.successMessages = [{
      severity: 'success',
      summary: header,
      detail: message
      }
    ]
  }

  showMessageWarning(header : string, message : string){    
    this.warningMessages = [{
      severity: 'warn',
      summary: header,
      detail: message
      }
    ]
  }
  
  showMessageError(header : string, message : string){    
    this.errorMessages = [{
      severity: 'error',
      summary: header,
      detail: message
      }
    ]
  }
  

}


/*
html : 
 <div class="messages-container">
  <p-messages [(value)]="this.MessageService.messages" [enableService]="false" [closable]="false"></p-messages>
</div>

css :   
.messages-container {
    position: fixed;
    top: 0;
    right: 0;
    margin: 10px; 
    z-index: 1000; 
  }
  

*/

