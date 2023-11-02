import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  value='';
  //searchBarValue='';
  searchValue= '';
  @Output() searchValueChanged = new EventEmitter<string>();
  /*
  onInputSearchBar(e : Event){
    this.searchBarValue = ((<HTMLInputElement>e.target).value);
    console.log((<HTMLInputElement>e.target).value)
  }
  */
  onSearchBarValueChange() {
    console.log(this.searchValue);
    this.searchValueChanged.emit(this.searchValue);


  }
}
