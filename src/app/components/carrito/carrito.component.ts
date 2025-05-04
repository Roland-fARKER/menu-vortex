import { Component, EventEmitter, Input, type OnChanges, Output, type SimpleChanges } from "@angular/core"
import { CommonModule } from "@angular/common"
import { CarritoService } from "../../services/carrito.service"
import type { ItemCarrito } from "../../models/producto.model"

@Component({
  selector: 'app-carrito',
  standalone: false,
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent implements OnChanges {
  @Input() abierto = false
  @Output() cerrar = new EventEmitter<void>()

  itemsCarrito: ItemCarrito[] = []
  total = 0

  constructor(private carritoService: CarritoService) {
    this.carritoService.carrito$.subscribe((items) => {
      this.itemsCarrito = items
      this.total = this.carritoService.obtenerTotal()
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["abierto"]) {
      console.log("Carrito componente - abierto:", this.abierto) // Para depuración
      if (this.abierto) {
        document.body.classList.add("no-scroll")
      } else {
        document.body.classList.remove("no-scroll")
      }
    }
  }

  cerrarCarrito(): void {
    this.cerrar.emit()
  }

  agregarItem(producto: ItemCarrito): void {
    this.carritoService.agregarAlCarrito(producto.producto)
  }

  eliminarItem(productoId: number): void {
    this.carritoService.eliminarDelCarrito(productoId)
  }

  realizarPedido(): void {
    // Implementar lógica para realizar el pedido
    alert("¡Pedido realizado con éxito!")
    this.cerrarCarrito()
  }
}
