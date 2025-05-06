import { Component } from '@angular/core';

@Component({
  selector: 'app-landing',
  standalone: false,
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class LandingComponent {
  // Para el formulario de contacto
  contactForm = {
    name: '',
    email: '',
    phone: '',
    businessName: '',
    message: '',
  };

  // Para las preguntas frecuentes
  faqs = [
    {
      question: '¿Cómo funciona el menú digital?',
      answer:
        'Nuestro menú digital es una plataforma web que permite a tus clientes ver tu menú, realizar pedidos y pagar desde sus dispositivos móviles. Tú recibes los pedidos en tiempo real y puedes gestionarlos desde nuestro panel de administración.',
      isOpen: false,
    },
    {
      question: '¿Necesito conocimientos técnicos para usar la plataforma?',
      answer:
        'No, nuestra plataforma está diseñada para ser intuitiva y fácil de usar. No necesitas conocimientos técnicos para configurar tu menú, subir productos o gestionar pedidos.',
      isOpen: false,
    },
    {
      question: '¿Puedo personalizar el diseño de mi menú?',
      answer:
        'Sí, puedes personalizar el logo, banner, colores y otros elementos visuales para que el menú refleje la identidad de tu negocio. También ofrecemos temas claro y oscuro.',
      isOpen: false,
    },
    {
      question: '¿Cómo acceden mis clientes al menú digital?',
      answer:
        'Tus clientes pueden acceder a tu menú digital escaneando un código QR que te proporcionamos, o a través de un enlace directo que puedes compartir en tus redes sociales o sitio web.',
      isOpen: false,
    },
    {
      question: '¿Cuánto cuesta el servicio?',
      answer:
        'Ofrecemos diferentes planes según las necesidades de tu negocio. Puedes comenzar con nuestro plan básico gratuito y actualizar a medida que tu negocio crece. Consulta la sección de precios para más detalles.',
      isOpen: false,
    },
  ];

  // Para las características
  features = [
    {
      icon: 'menu',
      title: 'Menú Digital Interactivo',
      description:
        'Muestra tus productos organizados por categorías con imágenes, descripciones y precios actualizados en tiempo real.',
    },
    {
      icon: 'shopping-cart',
      title: 'Carrito de Compras',
      description:
        'Permite a tus clientes seleccionar múltiples productos, personalizar sus pedidos y realizar el pago de forma sencilla.',
    },
    {
      icon: 'palette',
      title: 'Personalización Total',
      description:
        'Adapta el menú a tu marca con tu logo, banner, colores y estilo propio. Disponible en modo claro y oscuro.',
    },
    {
      icon: 'settings',
      title: 'Panel de Administración',
      description:
        'Gestiona productos, categorías, precios y pedidos desde un panel intuitivo y fácil de usar.',
    },
    {
      icon: 'map-pin',
      title: 'Ubicación y Contacto',
      description:
        'Muestra la ubicación de tu negocio en un mapa interactivo y facilita el contacto a través de redes sociales.',
    },
    {
      icon: 'smartphone',
      title: 'Diseño Responsivo',
      description:
        'Experiencia perfecta en cualquier dispositivo: móviles, tablets o computadoras.',
    },
  ];

  // Para los planes
  plans = [
    {
      name: 'Básico',
      price: 'Gratis',
      features: [
        'Menú digital básico',
        'Hasta 20 productos',
        'Personalización limitada',
        'Soporte por email',
        'Código QR básico',
      ],
      cta: 'Comenzar Gratis',
      highlighted: false,
    },
    {
      name: 'Profesional',
      price: '$19.99/mes',
      features: [
        'Menú digital completo',
        'Productos ilimitados',
        'Personalización completa',
        'Soporte prioritario',
        'Códigos QR personalizados',
        'Estadísticas básicas',
        'Sin marca de agua',
      ],
      cta: 'Elegir Plan',
      highlighted: true,
    },
    {
      name: 'Premium',
      price: '$39.99/mes',
      features: [
        'Todo lo de Profesional',
        'Sistema de pedidos online',
        'Integración con pasarelas de pago',
        'Estadísticas avanzadas',
        'Soporte 24/7',
        'Múltiples idiomas',
        'Dominio personalizado',
      ],
      cta: 'Elegir Plan',
      highlighted: false,
    },
  ];

  // Métodos
  toggleFaq(index: number): void {
    this.faqs[index].isOpen = !this.faqs[index].isOpen;
  }

  submitContactForm(): void {
    // En un entorno real, aquí enviaríamos el formulario a un backend
    console.log('Formulario enviado:', this.contactForm);
    alert('¡Gracias por contactarnos! Te responderemos a la brevedad.');
    this.contactForm = {
      name: '',
      email: '',
      phone: '',
      businessName: '',
      message: '',
    };
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  getIconSvg(iconName: string): string {
    switch (iconName) {
      case 'menu':
        return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>`;
      case 'shopping-cart':
        return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>`;
      case 'palette':
        return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5"></circle><circle cx="17.5" cy="10.5" r=".5"></circle><circle cx="8.5" cy="7.5" r=".5"></circle><circle cx="6.5" cy="12.5" r=".5"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path></svg>`;
      case 'settings':
        return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`;
      case 'map-pin':
        return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;
      case 'smartphone':
        return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>`;
      default:
        return '';
    }
  }
}
