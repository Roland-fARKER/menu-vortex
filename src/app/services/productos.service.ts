import { Injectable } from "@angular/core"
import { BehaviorSubject } from "rxjs"
import type { Categoria, Producto } from "../models/producto.model"

@Injectable({
  providedIn: "root",
})
export class ProductosService {
  eliminar(id: string) {
    throw new Error('Method not implemented.')
  }
  private categoriaActivaSubject = new BehaviorSubject<string>("todas")
  categoriaActiva$ = this.categoriaActivaSubject.asObservable()

  private productos: Producto[] = [
    {
      id: 1,
      nombre: "Hamburguesa Clásica",
      precio: 120,
      imagen: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/placeholder-ob7miW3mUreePYfXdVwkpFWHthzoR5.svg?height=40&width=40",
      categoria: "hamburguesas",
      descripcion: "Deliciosa hamburguesa con carne, lechuga, tomate y queso",
    },
    {
      id: 2,
      nombre: "Pizza Margherita",
      precio: 150,
      imagen: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/placeholder-ob7miW3mUreePYfXdVwkpFWHthzoR5.svg?height=40&width=40",
      categoria: "pizzas",
      descripcion: "Pizza tradicional con salsa de tomate, mozzarella y albahaca",
    },
    {
      id: 3,
      nombre: "Tacos al Pastor",
      precio: 90,
      imagen: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/placeholder-ob7miW3mUreePYfXdVwkpFWHthzoR5.svg?height=40&width=40",
      categoria: "tacos",
      descripcion: "Tacos de cerdo marinado con piña y cilantro",
    },
    {
      id: 4,
      nombre: "Ensalada César",
      precio: 85,
      imagen: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/placeholder-ob7miW3mUreePYfXdVwkpFWHthzoR5.svg?height=40&width=40",
      categoria: "ensaladas",
      descripcion: "Lechuga romana, crutones, aderezo césar y queso parmesano",
    },
    {
      id: 5,
      nombre: "Sushi Roll California",
      precio: 130,
      imagen: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/placeholder-ob7miW3mUreePYfXdVwkpFWHthzoR5.svg?height=40&width=40",
      categoria: "sushi",
      descripcion: "Roll con pepino, aguacate y cangrejo",
    },
    {
      id: 6,
      nombre: "Pasta Carbonara",
      precio: 110,
      imagen: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/placeholder-ob7miW3mUreePYfXdVwkpFWHthzoR5.svg?height=40&width=40",
      categoria: "pastas",
      descripcion: "Espagueti con salsa cremosa, tocino y queso parmesano",
    },
    {
      id: 7,
      nombre: "Burrito de Carne Asada",
      precio: 95,
      imagen: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/placeholder-ob7miW3mUreePYfXdVwkpFWHthzoR5.svg?height=40&width=40",
      categoria: "burritos",
      descripcion: "Burrito con carne asada, frijoles, arroz y guacamole",
    },
    {
      id: 8,
      nombre: "Hamburguesa Doble",
      precio: 160,
      imagen: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/placeholder-ob7miW3mUreePYfXdVwkpFWHthzoR5.svg?height=40&width=40",
      categoria: "hamburguesas",
      descripcion: "Hamburguesa con doble carne, tocino y queso cheddar",
    },
  ]

  private categorias: Categoria[] = [
    { id: "todos", nombre: "Todo" },
    { id: "hamburguesas", nombre: "Hamburguesas" },
    { id: "pizzas", nombre: "Pizzas" },
    { id: "tacos", nombre: "Tacos" },
    { id: "ensaladas", nombre: "Ensaladas" },
    { id: "sushi", nombre: "Sushi" },
    { id: "pastas", nombre: "Pastas" },
    { id: "burritos", nombre: "Burritos" },
  ]

  constructor() {}

  obtenerProductos(): Producto[] {
    return this.productos
  }

  obtenerCategorias(): Categoria[] {
    return this.categorias
  }

  obtenerProductosFiltrados(): Producto[] {
    const categoriaActiva = this.categoriaActivaSubject.value
    return categoriaActiva === "todas"
      ? this.productos
      : this.productos.filter((producto) => producto.categoria === categoriaActiva)
  }

  cambiarCategoria(categoria: string): void {
    this.categoriaActivaSubject.next(categoria)
  }
}
