import { Component } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { ProductosService } from '../../../services/productos.service';

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
    private productosService: ProductosService
  ) {
    this.authService.authState$.subscribe((state) => {
      this.businessName = state.business?.name || '';
    });

    this.totalProducts = this.productosService.obtenerProductos().length;
    this.totalCategories = this.productosService.obtenerCategorias().length;
  }
}
