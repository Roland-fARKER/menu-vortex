import { Component, EventEmitter, Input, Output } from '@angular/core';
import type { Producto } from '../../models/producto.model';
import { ExternalLink } from 'lucide-angular';  

@Component({
  selector: 'app-producto-card',
  standalone: false,
  templateUrl: './producto-card.component.html',
  styleUrl: './producto-card.component.css',
})
export class ProductoCardComponent {
  @Input() producto!: Producto;
  @Output() agregar = new EventEmitter<Producto>();

  mostrarPrevisualizacion = false;

  externalLink = ExternalLink;  

  agregarAlCarrito(): void {
    this.agregar.emit(this.producto);
  }
}
