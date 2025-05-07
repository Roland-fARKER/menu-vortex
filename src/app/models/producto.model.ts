export interface Producto {
  id?: number;
  nombre: string;
  precio: number;
  imagen: string;
  categoria: string;
  descripcion: string;
  businessId?: string;
}

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}

export interface Categoria {
  id?: string;
  nombre: string;
  descripcion?: string;
  icono?: string;
  businessId?: string;
}
