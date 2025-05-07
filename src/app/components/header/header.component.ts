import { Component, EventEmitter, Input, Output  } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../auth/services/auth.service';
import { Router } from '@angular/router';

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
  isMenuOpen = false
  isAuthenticated = false
  currentTheme: "light" | "dark" = "light"

  @Output() toggleCarritoEvent = new EventEmitter<void>()
  @Input() title: string = ''
  @Input() logoUrl: string = ''

  constructor(
    public carritoService: CarritoService,
    private themeService: ThemeService,
    private authService: AuthService,
    private router: Router,
  ) {
    this.carritoService.animarCarrito$.subscribe((animar: boolean) => {
      this.animarCarrito = animar
    })
  }

  ngOnInit(): void {
    // Suscribirse al tema actual
    this.themeService.theme$.subscribe((theme) => {
      this.currentTheme = theme
    })
  }

  toggleCarrito(): void {
    this.toggleCarritoEvent.emit()
  }
}
