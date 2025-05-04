import { Injectable } from "@angular/core"
import { BehaviorSubject } from "rxjs"
import type { ItemCarrito, Producto } from "../models/producto.model"

@Injectable({
  providedIn: "root",
})
export class CarritoService {
  private carritoSubject = new BehaviorSubject<ItemCarrito[]>([])
  carrito$ = this.carritoSubject.asObservable()

  private animarCarritoSubject = new BehaviorSubject<boolean>(false)
  animarCarrito$ = this.animarCarritoSubject.asObservable()

  constructor() {}

  agregarAlCarrito(producto: Producto): void {
    const carritoActual = this.carritoSubject.value
    const itemExistente = carritoActual.find((item) => item.producto.id === producto.id)

    if (itemExistente) {
      const carritoActualizado = carritoActual.map((item) =>
        item.producto.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item,
      )
      this.carritoSubject.next(carritoActualizado)
    } else {
      this.carritoSubject.next([...carritoActual, { producto, cantidad: 1 }])
    }

    // Activar animación
    this.animarCarritoSubject.next(true)
    setTimeout(() => this.animarCarritoSubject.next(false), 500)
  }

  eliminarDelCarrito(productoId: number): void {
    const carritoActual = this.carritoSubject.value
    const itemExistente = carritoActual.find((item) => item.producto.id === productoId)

    if (itemExistente && itemExistente.cantidad > 1) {
      const carritoActualizado = carritoActual.map((item) =>
        item.producto.id === productoId ? { ...item, cantidad: item.cantidad - 1 } : item,
      )
      this.carritoSubject.next(carritoActualizado)
    } else {
      const carritoActualizado = carritoActual.filter((item) => item.producto.id !== productoId)
      this.carritoSubject.next(carritoActualizado)
    }
  }

  obtenerTotal(): number {
    return this.carritoSubject.value.reduce((total, item) => {
      return total + item.producto.precio * item.cantidad
    }, 0)
  }

  obtenerCantidadItems(): number {
    return this.carritoSubject.value.reduce((total, item) => {
      return total + item.cantidad
    }, 0)
  }
}
