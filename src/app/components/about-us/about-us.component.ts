import { Component } from '@angular/core';

@Component({
  selector: 'app-about-us',
  standalone: false,
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css',
})
export class AboutUsComponent {
  // Puedes agregar métodos para manejar eventos del CTA aquí
  contactarNosotros(): void {
    // Implementar lógica para contacto
    alert('¡Gracias por tu interés! Pronto nos pondremos en contacto contigo.');
  }
}
