import { Component, Input } from '@angular/core';
import { MenuService } from 'src/app/servizi/menu.service';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css']
})
export class SearchbarComponent  {
  @Input() searchValue: string = '';

}
