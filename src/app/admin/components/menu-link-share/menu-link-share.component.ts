import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { ThemeService } from '../../../services/theme.service';
import { BusinessInfoService } from '../../../services/business.info.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menu-link-share',
  standalone: false,
  templateUrl: './menu-link-share.component.html',
  styleUrl: './menu-link-share.component.css',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('300ms ease-out', style({ opacity: 0 }))]),
    ]),
  ],
})
export class MenuLinkShareComponent implements OnInit, OnDestroy {
  @Input() businessId: string = ''

  currentTheme: "light" | "dark" = "light"
  menuLink = ""
  copied = false
  private themeSubscription: Subscription | null = null

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    // Suscribirse al servicio de tema para detectar cambios
    this.themeSubscription = this.themeService.theme$.subscribe((theme) => {
      this.currentTheme = theme
    })

    // Establecer el tema inicial
    this.currentTheme = this.themeService.getCurrentTheme()

    // Generar el enlace del menú
    this.generateMenuLink()
  }

  ngOnDestroy(): void {
    // Limpiar la suscripción al destruir el componente
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe()
    }
  }

  generateMenuLink(): void {
    // En un entorno real, esto podría venir de una configuración o API
    const baseUrl = window.location.origin
    const businessId = "mi-restaurante" // Esto podría venir de un servicio

    this.menuLink = `${baseUrl}/${this.businessId}`
  }

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.menuLink).then(() => {
      this.copied = true

      // Ocultar el mensaje después de 3 segundos
      setTimeout(() => {
        this.copied = false
      }, 3000)
    })
  }
}
