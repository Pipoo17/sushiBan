import { Component } from '@angular/core';
import { MenuService } from '../servizi/menu.service';

@Component({
  selector: 'app-categorie-piatti',
  templateUrl: './categorie-piatti.component.html',
  styleUrls: ['./categorie-piatti.component.css']
})
export class CategoriePiattiComponent {
  constructor(public servizioMenu: MenuService){}


  
}
