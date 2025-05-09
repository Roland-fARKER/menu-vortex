import { FormsModule } from '@angular/forms';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProductsComponent } from './components/products/products.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin.routing';
import { CategoriesComponent } from './components/categories/categories.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SettignsComponent } from './components/settigns/settigns.component';
import { Beef, Beer, CupSoda, Fish, Hamburger, IceCreamCone, LucideAngularModule, Pizza, Tag } from 'lucide-angular';
import { MenuLinkShareComponent } from './components/menu-link-share/menu-link-share.component';

@NgModule({
  declarations: [
    AdminLayoutComponent,
    DashboardComponent,
    ProductsComponent,
    CategoriesComponent,
    ProfileComponent,
    SettignsComponent,
    MenuLinkShareComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    FormsModule,
    LucideAngularModule.pick({
          CupSoda, Beef, Fish, Hamburger, Beer, Pizza, IceCreamCone, Tag
        })
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminModule {}
