import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../../../services/productos.service';
import { Producto, Categoria } from '../../../models/producto.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriesService } from '../../../services/categories.service';

@Component({
  selector: 'app-products',
  standalone: false,
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
  productos: Producto[] = [];
  categorias: Categoria[] = [];
  productoForm: FormGroup;

  isEditing = false;
  showForm = false;
  currentProductId: number | null = null;

  searchTerm = '';
  categoriaFiltro = 'todas';

  constructor(
    private productosService: ProductosService,
    private fb: FormBuilder,
    private categoriasService: CategoriesService
  ) {
    this.productoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      precio: [0, [Validators.required, Validators.min(1)]],
      descripcion: ['', [Validators.required]],
      categoria: ['', [Validators.required]],
      imagen: ['assets/placeholder.webp'],
    });
  }

  ngOnInit(): void {
    this.productosService.obtenerProductos().subscribe((data) => {
      this.productos = data;
    });

    this.categoriasService.obtenerCategorias().subscribe((categorias) => {
      this.categorias = categorias;
    });

    console.log(this.categorias); // Para depuración
  }

  get productosFiltrados(): Producto[] {
    return this.productos.filter((p) => {
      const coincideBusqueda = p.nombre
        .toLowerCase()
        .includes(this.searchTerm.toLowerCase());
      const coincideCategoria =
        this.categoriaFiltro === 'todas' ||
        p.categoria === this.categoriaFiltro;
      return coincideBusqueda && coincideCategoria;
    });
  }

  openForm(producto?: Producto): void {
    this.showForm = true;

    if (producto) {
      this.isEditing = true;
      this.currentProductId = producto.id ?? null;
      this.productoForm.patchValue({
        nombre: producto.nombre,
        precio: producto.precio,
        descripcion: producto.descripcion,
        categoria: producto.categoria,
        imagen: producto.imagen,
      });
    } else {
      this.isEditing = false;
      this.currentProductId = null;
      this.productoForm.reset({
        precio: 0,
        imagen: 'assets/placeholder.png',
      });
    }
  }

  closeForm(): void {
    this.showForm = false;
    this.productoForm.reset();
  }

  onSubmit(): void {
    if (this.productoForm.valid) {
      const productoData = this.productoForm.value;
  
      if (this.isEditing && this.currentProductId !== null) {
        const productoActualizado: Producto = {
          id: this.currentProductId,
          ...productoData,
        };
  
        this.productosService.actualizarProducto(productoActualizado.id?.toString() || '', productoActualizado).then(() => {
          const index = this.productos.findIndex(p => p.id === this.currentProductId);
          this.closeForm();
        });
  
      } else {
        this.productosService.crearProducto(productoData).then((nuevoProducto) => {
          this.productos.push(nuevoProducto);
          this.closeForm();
        });
      }
    }
  }

  deleteProducto(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.productos = this.productos.filter((p) => p.id !== id);
    }
  }

  // Método auxiliar para generar IDs únicos
  private getNextId( id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.productosService.eliminarProducto(id.toString()).then(() => {
        this.productos = this.productos.filter(p => p.id !== id);
      });
    }
  }

  getCategoriaNombre(categoriaId: string): string {
    const categoria = this.categorias.find((c) => c.id === categoriaId);
    return categoria ? categoria.nombre : categoriaId;
  }
}
