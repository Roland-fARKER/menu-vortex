import {
  Component,
  type OnInit,
  ViewChild,
  type ElementRef,
} from '@angular/core';
import { ProductosService } from '../../../services/productos.service';
import type { Producto, Categoria } from '../../../models/producto.model';
import { FormBuilder, type FormGroup, Validators } from '@angular/forms';
import { CategoriesService } from '../../../services/categories.service';
import {
  Storage,
  ref,
  uploadBytes,
  getDownloadURL,
} from '@angular/fire/storage';
import { AuthService } from '../../../auth/services/auth.service';
import { ImageOptimizationService } from '../../../services/imageOptimization.service';

@Component({
  selector: 'app-products',
  standalone: false,
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
  @ViewChild('imageInput') imageInput!: ElementRef<HTMLInputElement>;

  productos: Producto[] = [];
  categorias: Categoria[] = [];
  productoForm: FormGroup;

  isEditing = false;
  showForm = false;
  currentProductId: number | null = null;

  searchTerm = '';
  categoriaFiltro = 'todas';

  // Para la previsualización de la imagen
  imagePreview: string | null = null;
  selectedFile: any;
  businessId = '';

  constructor(
    private productosService: ProductosService,
    private fb: FormBuilder,
    private categoriasService: CategoriesService,
    private storage: Storage,
    private authService: AuthService,
    private imageOptimizationService: ImageOptimizationService
  ) {
    this.productoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      precio: [0, [Validators.required, Validators.min(1)]],
      descripcion: ['', [Validators.required]],
      categoria: ['', [Validators.required]],
      imagen: [''],
      disponible: [true],
    });

    this.authService.authState$.subscribe((state) => {
      console.log('authState', state);
      this.businessId = state.business?.id || '';
    });
  }

  ngOnInit(): void {
    this.productosService
      .getProductosPorNegocio(this.businessId)
      .subscribe((data) => {
        this.productos = data;
      });

    this.categoriasService
      .obtenerCategoriasPorNegocio(this.businessId)
      .subscribe((categorias) => {
        this.categorias = categorias;
      });
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
    this.imagePreview = null;

    if (producto) {
      this.isEditing = true;
      this.currentProductId = producto.id ?? null;
      this.productoForm.patchValue({
        nombre: producto.nombre,
        precio: producto.precio,
        descripcion: producto.descripcion,
        categoria: producto.categoria,
        imagen: producto.imagen,
        disponible: producto.disponible,
      });

      // Establecer la previsualización de la imagen si existe
      this.imagePreview = producto.imagen;
    } else {
      this.isEditing = false;
      this.currentProductId = null;
      this.productoForm.reset({
        precio: 0,
      });
    }
  }

  closeForm(): void {
    this.showForm = false;
    this.productoForm.reset();
    this.imagePreview = null;
  }

  onSubmit(): void {
    if (this.productoForm.valid) {
      const productoData = this.productoForm.value;

      if (!productoData.imagen) {
        productoData.imagen = 'assets/placeholder.png';
      }

      // ✅ Si es edición
      if (this.isEditing && this.currentProductId !== null) {
        const productoActualizado: Producto = {
          id: this.currentProductId,
          ...productoData,
        };

        this.productosService
          .actualizarProducto(
            productoActualizado.id?.toString() || '',
            productoActualizado
          )
          .then(() => {
            const index = this.productos.findIndex(
              (p) => p.id === this.currentProductId
            );
            if (index !== -1) {
              this.productos[index] = productoActualizado;
            }
            this.closeForm();
          });
      } else {
        // ✅ Añadir el businessId antes de guardar
        if (this.businessId) {
          productoData.businessId = this.businessId;
        } else {
          console.error('No hay business cargado');
          return;
        }

        this.productosService
          .crearProducto(productoData)
          .then((nuevoProducto) => {
            this.productos.push(nuevoProducto);
            this.closeForm();
          });
      }
    }
  }

  deleteProducto(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.productosService.eliminarProducto(id.toString()).then(() => {
        this.productos = this.productos.filter((p) => p.id !== id);
      });
    }
  }

  getCategoriaNombre(categoriaId: string): string {
    const categoria = this.categorias.find((c) => c.id === categoriaId);
    return categoria ? categoria.nombre : categoriaId;
  }

  // Métodos para manejar la carga de imágenes
  onImageClick(): void {
    this.imageInput.nativeElement.click();
  }

  async onImageChange(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecciona un archivo de imagen válido.');
        return;
      }

      try {
        
        const optimizedFile =
          await this.imageOptimizationService.optimizeImageToWebp(file, 0.5);

        // Mostrar previsualización usando la imagen optimizada (local)
        this.imagePreview = URL.createObjectURL(optimizedFile);

        // Subir la imagen optimizada y obtener URL
        const imageUrl = await this.uploadImage(optimizedFile);
        this.productoForm.patchValue({ imagen: imageUrl });
      } catch (error) {
        console.error('Error al optimizar o subir la imagen:', error);
        alert('Error al procesar la imagen. Intenta nuevamente.');
      }
    }
  }

  async uploadImage(file: File): Promise<string> {
    const timestamp = Date.now();
    const filePath = `productos/${this.businessId}/${timestamp}_${file.name}`;
    const storageRef = ref(this.storage, filePath);

    // Subir la imagen
    const snapshot = await uploadBytes(storageRef, file);

    // Obtener la URL de descarga
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }
}
