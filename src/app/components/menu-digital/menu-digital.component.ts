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
    private productosService: ProductosService,
    private categoriasService: CategoriesService  
  ) {}

  ngOnInit(): void {
    this.productosService.obtenerProductos().subscribe((productos) => {
      this.productos = productos;
    });
    

    this.categoriasService.obtenerCategorias().subscribe((cates) => {
      this.categorias = cates;
      console.log(this.categorias); // Para depuración
      this.actualizarProductosFiltrados();
    } )

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
