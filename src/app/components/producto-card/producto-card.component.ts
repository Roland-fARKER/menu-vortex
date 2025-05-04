import { Component,  EventEmitter, Input, Output } from '@angular/core';
import type { Producto } from "../../models/producto.model"

@Component({
  selector: 'app-producto-card',
  standalone: false,
  templateUrl: './producto-card.component.html',
  styleUrl: './producto-card.component.css'
})
export class ProductoCardComponent {
  @Input() producto!: Producto
  @Output() agregar = new EventEmitter<Producto>()

  agregarAlCarrito(): void {
    this.agregar.emit(this.producto)
  }
}
