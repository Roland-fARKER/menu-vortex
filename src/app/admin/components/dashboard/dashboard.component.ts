import { Component } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { ProductosService } from '../../../services/productos.service';
import { CategoriesService } from '../../../services/categories.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  businessName = '';
  totalProducts = 0;
  totalCategories = 0;

  constructor(
    private authService: AuthService,
    private productosService: ProductosService,
    private categoriesService: CategoriesService
  ) {
    this.authService.authState$.subscribe((state) => {
      console.log('authState', state);
      this.businessName = state.business?.name || '';
    });

    this.productosService.obtenerProductos().subscribe((productos) => {
      this.totalProducts = productos.length;
    });

    this.categoriesService.obtenerCategorias().subscribe((categorias) => {
      this.totalCategories = categorias.length;
    });

  }
}
