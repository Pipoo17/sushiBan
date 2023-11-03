import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-ordine-succes',
  templateUrl: './ordine-succes.component.html',
  styleUrls: ['./ordine-succes.component.css']
})
export class OrdineSuccesComponent implements OnInit {

  
  options: AnimationOptions = {    
    path: '/assets/lottie/ordini/ordineSucces.json' ,
    loop: true, 
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    },

  };  

  /*
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  }
*/

  constructor() { }  

  ngOnInit(): void {  }

  
  onAnimate(animationItem: AnimationItem): void {    
    console.log(animationItem);  
  }

}
