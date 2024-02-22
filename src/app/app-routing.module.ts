import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfiloComponent } from './pagine/profilo/profilo.component';
import { OrdiniComponent } from './pagine/ordini/ordini.component';
import { StatisticheComponent } from './pagine/statistiche/statistiche.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './pagine/home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ErrorComponent } from './pagine/error/error.component';
import { ResetPasswordComponent } from './auth/resetPassword/reset-password/reset-password.component';
import { EmailFormComponent } from './auth/resetPassword/email-form/email-form.component';
import { DatiMenuComponent } from './pagine/dati-menu/dati-menu.component';

const routes: Routes = [
  {path:'', component: HomeComponent, title: 'Sushiban'},
  {path:'profilo', component: ProfiloComponent, title: 'Profilo'},
  {path:'ordini', component: OrdiniComponent, title: 'Ordini'},
  {path:'statistiche', component: StatisticheComponent, title: 'Statistiche'},
  {path:'home', component: HomeComponent},
  {path:'login', component: LoginComponent},
  {path:'register', component: RegisterComponent},
  {path:'datiMenu', component: DatiMenuComponent},
  {path:'ResetPassword/Password', component: ResetPasswordComponent},
  {path:'ResetPassword/Email', component: EmailFormComponent},
  {path:'404', component: ErrorComponent, title: 'Pagina non trovata'},
  {path:'**', pathMatch: 'full', redirectTo : '/404' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
