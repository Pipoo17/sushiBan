import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatDividerModule} from '@angular/material/divider';
import { ResponsiveSidebarComponent } from './component/responsive-sidebar/responsive-sidebar.component';
import { ProfiloComponent } from './pagine/profilo/profilo.component';
import { HomeComponent } from './pagine/home/home.component';
import { OrdiniComponent } from './pagine/ordini/ordini.component';
import { StatisticheComponent } from './pagine/statistiche/statistiche.component';
import { FooterComponent } from './component/footer/footer.component';
import { LoginComponent } from './auth/login/login.component';
import { ErrorComponent } from './pagine/error/error.component';
import {MatDialogModule} from '@angular/material/dialog';
import { CarrelloComponent } from './pagine/carrello/carrello.component';
import { PulsanteCarrelloComponent } from './component/pulsante-carrello/pulsante-carrello.component';
import {MatTabsModule} from '@angular/material/tabs';
import { CardPiattoComponent } from './component/card-piatto/card-piatto.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';
import { RegisterComponent } from './auth/register/register.component';
import { LogoutPopupComponent } from './auth/logout-popup/logout-popup.component';
import { SupabaseService } from './servizi/supabase.service';
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { MessagesModule } from 'primeng/messages';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { ConfirmDialogComponent } from './component/confirm-dialog/confirm-dialog.component';
import { MessageComponentComponent } from './component/message-component/message-component.component';
import { ResetPasswordComponent } from './auth/resetPassword/reset-password/reset-password.component';
import { EmailFormComponent } from './auth/resetPassword/email-form/email-form.component';
import { DatiMenuComponent } from './pagine/dati-menu/dati-menu.component';
export function playerFactory(): any {  
  return import('lottie-web');
}


@NgModule({
  declarations: [
    AppComponent,
    ResponsiveSidebarComponent,
    ProfiloComponent,
    HomeComponent,
    OrdiniComponent,
    StatisticheComponent,
    FooterComponent,
    LoginComponent,
    ErrorComponent,
    CarrelloComponent,
    PulsanteCarrelloComponent,
    CardPiattoComponent,
    RegisterComponent,
    LogoutPopupComponent,
    ConfirmDialogComponent,
    MessageComponentComponent,
    ResetPasswordComponent,
    EmailFormComponent,
    DatiMenuComponent,
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
    ButtonModule,
    ChartModule,
    TableModule,
  ],

  providers: [
    SupabaseService, 
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
