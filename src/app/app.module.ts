import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import { NavbarComponent } from './navbar/navbar.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatDividerModule} from '@angular/material/divider';
import { ResponsiveSidebarComponent } from './responsive-sidebar/responsive-sidebar.component';
import { ProfiloComponent } from './pagine/profilo/profilo.component';
import { HomeComponent } from './pagine/home/home.component';
import { OrdiniComponent } from './pagine/ordini/ordini.component';
import { SearchbarComponent } from './searchbar/searchbar.component';
import { StatisticheComponent } from './pagine/statistiche/statistiche.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './pagine/login/login.component';
import { ErrorComponent } from './pagine/error/error.component';
import { ErrorLayoutComponent } from './pagine/error-layout/error-layout.component';
import {MatDialogModule} from '@angular/material/dialog';
import { CarrelloComponent } from './pagine/carrello/carrello.component';
import { PulsanteCarrelloComponent } from './pulsante-carrello/pulsante-carrello.component';
import {MatTabsModule} from '@angular/material/tabs';
import { CardPiattoComponent } from './card-piatto/card-piatto.component';
import { CategoriePiattiComponent } from './categorie-piatti/categorie-piatti.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';
import { RegisterComponent } from './pagine/register/register.component';
import { AccessoNegatoComponent } from './pagine/accesso-negato/accesso-negato.component';
import { LogoutPopupComponent } from './pagine/logout-popup/logout-popup.component';
import { SupabaseService } from './servizi/supabase.service';
import { OrdineSuccesComponent } from './animazioni/ordine-succes/ordine-succes.component';
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { MessagesModule } from 'primeng/messages';


export function playerFactory(): any {  
  return import('lottie-web');
}


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ResponsiveSidebarComponent,
    ProfiloComponent,
    HomeComponent,
    OrdiniComponent,
    SearchbarComponent,
    StatisticheComponent,
    FooterComponent,
    LoginComponent,
    ErrorComponent,
    ErrorLayoutComponent,
    CarrelloComponent,
    PulsanteCarrelloComponent,
    CardPiattoComponent,
    CategoriePiattiComponent,
    RegisterComponent,
    AccessoNegatoComponent,
    LogoutPopupComponent,
    OrdineSuccesComponent
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatDividerModule,
    MatDialogModule,
    MatTabsModule,
    MatSnackBarModule,
    HttpClientModule,
    LottieModule.forRoot({ player: playerFactory }),  
    ToggleButtonModule,
    MessagesModule,
  ],

  providers: [
    SupabaseService, 
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
