import { Component, EventEmitter, Output  } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  animations: [
    trigger('badgeAnimation', [
      transition('false => true', [
        style({ transform: 'scale(0.5)', opacity: 0 }),
        animate(
          '300ms ease-out',
          style({ transform: 'scale(1.2)', opacity: 1 })
        ),
        animate('200ms ease-out', style({ transform: 'scale(1)', opacity: 1 })),
      ]),
    ]),
  ],
})
export class HeaderComponent {
  animarCarrito = false
  @Output() toggleCarritoEvent = new EventEmitter<void>()

  constructor(public carritoService: CarritoService) {
    this.carritoService.animarCarrito$.subscribe((animar) => {
      this.animarCarrito = animar
    })
  }

  toggleCarrito(): void {
    this.toggleCarritoEvent.emit()
    console.log("Carrito abierto:", this.carritoService.carrito$)
  }
}
