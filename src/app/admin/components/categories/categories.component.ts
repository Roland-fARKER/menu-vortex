import { Component } from '@angular/core';
import { Categoria, Producto } from '../../../models/producto.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductosService } from '../../../services/productos.service';
import { map } from 'rxjs';
import { CategoriesService } from '../../../services/categories.service';
import { AuthService } from '../../../auth/services/auth.service';
import {
  CupSoda,
  Beef,
  Fish,
  Hamburger,
  Beer,
  Pizza,
  IceCreamCone,
  Tag,
} from 'lucide-angular';

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
    this.categoriasService
      .obtenerCategoriasPorNegocio(this.businessId)
      .subscribe((categorias) => {
        this.categorias = categorias;

        this.productosService.obtenerProductos().subscribe((productos) => {
          for (const cat of categorias) {
            const count = productos.filter(
              (p) => p.categoria === cat.id
            ).length;
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
      const businessId = this.businessId;
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
          this.categoriasService
            .obtenerCategoriasPorNegocio(businessId)
            .subscribe((categorias) => {
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
