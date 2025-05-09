import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CarritoService } from '../../services/carrito.service';
import { ItemCarrito } from '../../models/producto.model';

@Component({
  selector: 'app-carrito',
  standalone: false,
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css'],
})
export class CarritoComponent implements OnChanges {
  @Input() abierto = false;
  @Output() cerrar = new EventEmitter<void>();
  @Input() whatsapp: string = '';

  itemsCarrito: ItemCarrito[] = [];
  total = 0;
  nombreCliente: string = '';
  direccionCliente: string = '';
  mostrarModal: boolean = false; // Para controlar la visibilidad del modal

  constructor(private carritoService: CarritoService) {
    this.carritoService.carrito$.subscribe((items) => {
      this.itemsCarrito = items;
      this.total = this.carritoService.obtenerTotal();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['abierto']) {
      if (this.abierto) {
        document.body.classList.add('no-scroll');
      } else {
        document.body.classList.remove('no-scroll');
      }
    }
  }

  cerrarCarrito(): void {
    this.cerrar.emit();
  }

  agregarItem(producto: ItemCarrito): void {
    this.carritoService.agregarAlCarrito(producto.producto);
  }

  eliminarItem(productoId: number): void {
    this.carritoService.eliminarDelCarrito(productoId);
  }

  mostrarFormulario(): void {
    this.mostrarModal = true;
  }

  async realizarPedido(): Promise<void> {
    if (!this.nombreCliente || !this.direccionCliente) {
      console.warn('Por favor, ingrese su nombre y dirección.');
      return;
    }

    this.carritoService.enviarPedidoPorWhatsApp(
      this.nombreCliente,
      this.direccionCliente,
    );
    await this.carritoService.limpiarCarrito();
    this.cerrarCarrito();
    this.mostrarModal = false;
  }
}
