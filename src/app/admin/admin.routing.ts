import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProductsComponent } from './components/products/products.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SettignsComponent } from './components/settigns/settigns.component';

const routes: Routes = [
    {
        path: '',
        component: AdminLayoutComponent,
        children: [
          {
            path: 'dashboard',
            component: DashboardComponent,
          },
          {
            path: 'products',
            component: ProductsComponent,
          },
          {
            path: 'categories',
            component: CategoriesComponent,
          },
          {
            path: 'profile',
            component: ProfileComponent,
          },
          {
            path: 'settings',
            component: SettignsComponent,
          },
          {
            path: '',
            redirectTo: 'dashboard',
            pathMatch: 'full',
          }
        ],
      },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
