import { Component, OnInit } from '@angular/core';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger,
} from '@angular/animations';
import { CarritoService } from '../../services/carrito.service';
import { ProductosService } from '../../services/productos.service';
import type { Categoria, Producto } from '../../models/producto.model';
import { CategoriesService } from '../../services/categories.service';

import { ActivatedRoute } from '@angular/router';
import { BusinessInfoService } from '../../services/business.info.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Business } from '../../models/business.model';

@Component({
  selector: 'app-menu-digital',
  standalone: false,
  templateUrl: './menu-digital.component.html',
  styleUrl: './menu-digital.component.css',
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'scale(0.9)' }),
            stagger(50, [
              animate(
                '300ms ease-out',
                style({ opacity: 1, transform: 'scale(1)' })
              ),
            ]),
          ],
          { optional: true }
        ),
      ]),
    ]),
  ],
})
export class MenuDigitalComponent implements OnInit {
  productos: Producto[] = [];
  categorias: Categoria[] = [];
  productosFiltrados: Producto[] = [];
  categoriaActiva = 'todas';
  carritoAbierto = false;

  latitud: number | null = null;
longitud: number | null = null;

  business: Business | null = null;

  isLoading = true;

  businessId: string = '';

  constructor(
    private carritoService: CarritoService,
    private productosService: ProductosService,
    private categoriasService: CategoriesService,
    private route: ActivatedRoute,
    private businessService: BusinessInfoService
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    console.log('Slug:', slug); // Para depuración

    if (slug) {
      this.businessService.getBusinessBySlug(slug).subscribe(
        (business) => {
          this.business = business;

          if (!this.business) {
            console.error('Negocio no encontrado');
            return;
          }

          if (this.business?.location?.lat && this.business?.location?.lng) {
            this.latitud = this.business.location.lat;
            this.longitud = this.business.location.lng;
            console.log('Coordenadas del negocio:', this.latitud, this.longitud);
          } else {
            console.warn('El negocio no tiene coordenadas definidas.');
          }

          console.log('Negocio cargado:', this.business);
          this.businessId = this.business.id ?? '';

          // ✅ Cargar productos
          this.productosService
            .getProductosPorNegocio(this.businessId)
            .subscribe((prods) => {
              this.productos = prods;
              this.productosFiltrados = prods;
            });

          // ✅ Cargar categorías (DESPUÉS de tener businessId)
          this.categoriasService
            .obtenerCategoriasPorNegocio(this.businessId)
            .subscribe((categori) => {
              this.categorias = categori;
              console.log('Categorías:', this.categorias);
              this.isLoading = false;
            });
        },
        (error) => {
          console.error('Error al cargar el negocio:', error);
        }
      );
    }
  }

  actualizarProductosFiltrados(): void {
    this.productosService.obtenerProductos().subscribe((productos) => {
      this.productosFiltrados = productos;
    });
  }

  cambiarCategoria(categoriaId: string): void {
    this.categoriaActiva = categoriaId;

    if (categoriaId === 'todas') {
      this.productosFiltrados = this.productos;
    } else {
      this.productosFiltrados = this.productos.filter(
        (producto) => producto.categoria === categoriaId
      );
    }
  }

  agregarAlCarrito(producto: Producto): void {
    this.carritoService.agregarAlCarrito(producto);
  }

  toggleCarrito(): void {
    this.carritoAbierto = !this.carritoAbierto;
    console.log('Carrito abierto:', this.carritoAbierto);
  }
}
