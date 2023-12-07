import { Component } from '@angular/core';
import { MessageService } from '../servizi/message.service';


@Component({
  selector: 'app-message-component',
  templateUrl: './message-component.component.html',
  styleUrls: ['./message-component.component.css']
})
export class MessageComponentComponent {

constructor(
public MessageService : MessageService,

){

}

}
