import { Component } from '@angular/core';
import { Categoria, Producto } from '../../../models/producto.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductosService } from '../../../services/productos.service';
import { map } from 'rxjs';
import { CategoriesService } from '../../../services/categories.service';
import { AuthService } from '../../../auth/services/auth.service';
@Component({
  selector: 'app-categories',
  standalone: false,
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent {
  categorias: Categoria[] = [];
  categoriaForm: FormGroup;
  isEditing = false;
  showForm = false;
  currentCategoryId: string | null = null;
  searchTerm = '';
  productCountMap = new Map<string, number>();
  businessId = '';

  constructor(
    private productosService: ProductosService,
    private fb: FormBuilder,
    private categoriasService: CategoriesService,
    private authService: AuthService
  ) {
    this.categoriaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: [''],
      icono: [''],
    });

    this.authService.authState$.subscribe((state) => {
      console.log('authState', state);
      this.businessId = state.business?.id || '';
    });
  }

  ngOnInit(): void {
    this.categoriasService.obtenerCategoriasPorNegocio(this.businessId).subscribe((categorias) => {
      this.categorias = categorias;

      this.productosService.obtenerProductos().subscribe((productos) => {
        for (const cat of categorias) {
          const count = productos.filter((p) => p.categoria === cat.id).length;
          this.productCountMap.set(cat.id || '', count);
        }
      });
    });
  }

  get categoriasFiltradas(): Categoria[] {
    return this.categorias.filter((categoria) => {
      return (
        this.searchTerm === '' ||
        categoria.nombre
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        (categoria.descripcion &&
          categoria.descripcion
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase()))
      );
    });
  }

  openForm(categoria?: Categoria): void {
    this.showForm = true;

    if (categoria) {
      this.isEditing = true;
      this.currentCategoryId = categoria.id ?? null;
      this.categoriaForm.patchValue({
        nombre: categoria.nombre,
        descripcion: categoria.descripcion || '',
        icono: categoria.icono || '',
      });
    } else {
      this.isEditing = false;
      this.currentCategoryId = null;
      this.categoriaForm.reset();
    }
  }

  closeForm(): void {
    this.showForm = false;
    this.categoriaForm.reset();
  }

  onSubmit(): void {
    if (this.categoriaForm.valid) {
      const categoriaData = this.categoriaForm.value;
  
      // Asegurar que el businessId esté disponible
      const businessId = this.businessId ;
      if (!businessId) {
        console.error('No se encontró el ID del negocio');
        return;
      }
  
      // Agregar businessId al objeto de categoría
      categoriaData.businessId = businessId;
  
      if (this.isEditing && this.currentCategoryId !== null) {
        this.categoriasService
          .actualizarCategoria(this.currentCategoryId, categoriaData)
          .then(() => {
            this.closeForm();
          });
      } else {
        this.categoriasService.crearCategoria(categoriaData).then(() => {
          this.closeForm();
          this.categoriasService.obtenerCategoriasPorNegocio(businessId).subscribe((categorias) => {
            this.categorias = categorias;
          });
        });
      }
    }
  }
  

  deleteCategoria(id: string): void {
    const productosEnCategoria = this.productosService
      .obtenerProductos()
      .pipe(
        map((productos: Producto[]) =>
          productos.filter((p) => p.categoria === id)
        )
      );

    productosEnCategoria.subscribe((productos) => {
      if (productos.length > 0) {
        alert(
          `No se puede eliminar esta categoría porque hay ${productos.length} productos asociados.`
        );
        return;
      }

      if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
        this.categoriasService.eliminarCategoria(id);
      }
    });
  }

  // Método para obtener el icono de la categoría
  getCategoryIcon(icono?: string): string {
    if (!icono) {
      return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>`;
    }

    // Aquí podrías tener una lógica para mapear nombres de iconos a SVGs
    // Por simplicidad, devolvemos algunos iconos predefinidos
    switch (icono) {
      case 'hamburguesa':
        return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16"></path><path d="M4 12h16"></path><path d="M4 18h16"></path></svg>`;
      case 'pizza':
        return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg>`;
      case 'bebida':
        return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2h8l2 8.5c1 3 1 6.5 0 9.5L16 22H8l-2-2c-1-3-1-6.5 0-9.5L8 2Z"></path><path d="M8 2l-2 8.5c-1 3-1 6.5 0 9.5l2 2"></path><path d="M16 2l2 8.5c1 3 1 6.5 0 9.5l-2 2"></path></svg>`;
      case 'postre':
        return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>`;
      default:
        return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>`;
    }
  }

  // Método para obtener la cantidad de productos por categoría
  getProductCountByCategory(categoryId: string): number {
    let count = 0;
    this.productosService.obtenerProductos().subscribe((productos) => {
      count = productos.filter(
        (producto) => producto.categoria === categoryId
      ).length;
    });
    return count;
  }
}
