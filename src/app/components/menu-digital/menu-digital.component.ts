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
import { HeaderComponent } from '../header/header.component';
import { ProductoCardComponent } from '../producto-card/producto-card.component';
import { CarritoComponent } from '../carrito/carrito.component';

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

  constructor(
    private carritoService: CarritoService,
    private productosService: ProductosService
  ) {}

  ngOnInit(): void {
    this.productos = this.productosService.obtenerProductos();
    this.categorias = this.productosService.obtenerCategorias();
    this.actualizarProductosFiltrados();

    this.productosService.categoriaActiva$.subscribe((categoria) => {
      this.categoriaActiva = categoria;
      this.actualizarProductosFiltrados();
    });
  }

  actualizarProductosFiltrados(): void {
    this.productosFiltrados = this.productosService.obtenerProductosFiltrados();
  }

  cambiarCategoria(categoria: string): void {
    this.productosService.cambiarCategoria(categoria);
  }

  agregarAlCarrito(producto: Producto): void {
    this.carritoService.agregarAlCarrito(producto);
  }

  toggleCarrito(): void {
    this.carritoAbierto = !this.carritoAbierto
    console.log("Carrito abierto:", this.carritoAbierto) // Para depuración
  }
}
