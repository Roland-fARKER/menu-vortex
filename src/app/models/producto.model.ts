export interface Producto {
    id: number
    nombre: string
    precio: number
    imagen: string
    categoria: string
    descripcion: string
}
  
export interface ItemCarrito {
    producto: Producto
    cantidad: number
}
  
export interface Categoria {
    id: string
    nombre: string
}
