import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuDigitalComponent } from './components/menu-digital/menu-digital.component';
import { LandingComponent } from './components/landing/landing.component';

const routes: Routes = [
  {path: '', component: LandingComponent},
  { path:'auth', loadChildren:()=> import('./auth/auth.module').then(m => m.AuthModule) },
  {path: 'admin', loadChildren:()=> import('./admin/admin.module').then(m => m.AdminModule) },
  // Ruta dinámica para negocios
  { path: ':slug', component: MenuDigitalComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
