import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../../../services/productos.service';
import { Producto, Categoria } from '../../../models/producto.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
    private fb: FormBuilder
  ) {
    this.productoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      precio: [0, [Validators.required, Validators.min(1)]],
      descripcion: ['', [Validators.required]],
      categoria: ['', [Validators.required]],
      imagen: ['assets/placeholder.png'],
    });
  }

  ngOnInit(): void {
    this.productos = this.productosService.obtenerProductos();
    this.categorias = this.productosService.obtenerCategorias();
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
      this.currentProductId = producto.id;
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
        // Actualizar producto existente
        const productoActualizado: Producto = {
          id: this.currentProductId,
          ...productoData,
        };


        const index = this.productos.findIndex(
          (p) => p.id === this.currentProductId
        );
        if (index !== -1) {
          this.productos[index] = productoActualizado;
        }
      } else {
        // Crear nuevo producto
        const nuevoProducto: Producto = {
          id: this.getNextId(),
          ...productoData,
        };

        this.productos.push(nuevoProducto);
      }

      this.closeForm();
    }
  }

  deleteProducto(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.productos = this.productos.filter((p) => p.id !== id);
    }
  }

  // Método auxiliar para generar IDs únicos
  private getNextId(): number {
    return Math.max(0, ...this.productos.map((p) => p.id)) + 1;
  }

  getCategoriaNombre(categoriaId: string): string {
    const categoria = this.categorias.find((c) => c.id === categoriaId);
    return categoria ? categoria.nombre : categoriaId;
  }
}
