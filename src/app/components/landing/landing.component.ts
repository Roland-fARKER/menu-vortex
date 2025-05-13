import { Component } from '@angular/core';
import { ContactoService } from '../../services/contacto.service';
import { Contacto } from '../../models/contacto';

@Component({
  selector: 'app-landing',
  standalone: false,
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class LandingComponent {
  // Para el formulario de contacto
  contactForm: Contacto = {
    name: '',
    email: '',
    phone: '',
    businessName: '',
    message: '',
    fechaEnvio: new Date()
  };

  constructor(private contactoService: ContactoService) {}

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
      icon: 'Newspaper',
      title: 'Menú Digital Interactivo',
      description:
        'Muestra tus productos organizados por categorías con imágenes, descripciones y precios actualizados en tiempo real.',
    },
    {
      icon: 'ShoppingCart',
      title: 'Carrito de Compras',
      description:
        'Permite a tus clientes seleccionar múltiples productos, personalizar sus pedidos y realizar el pago de forma sencilla.',
    },
    {
      icon: 'Pencil',
      title: 'Personalización Total',
      description:
        'Adapta el menú a tu marca con tu logo, banner, colores y estilo propio. Disponible en modo claro y oscuro.',
    },
    {
      icon: 'ChartLine',
      title: 'Panel de Administración',
      description:
        'Gestiona productos, categorías, precios y pedidos desde un panel intuitivo y fácil de usar.',
    },
    {
      icon: 'MapPin',
      title: 'Ubicación y Contacto',
      description:
        'Muestra la ubicación de tu negocio en un mapa interactivo y facilita el contacto a través de redes sociales.',
    },
    {
      icon: 'TabletSmartphone',
      title: 'Diseño Responsivo',
      description:
        'Experiencia perfecta en cualquier dispositivo: móviles, tablets o computadoras.',
    },
  ];

  // Para los planes
  plans = [
    {
      name: 'Básico',
      price: 'C$ 150/ mes',
      features: [
        'Menú digital básico',
        'Hasta 20 productos',
        'Personalización limitada',
        'Soporte por email',
        'Código QR básico',
      ],
      cta: 'Elegir Plan',
      highlighted: false,
    },
    {
      name: 'Profesional',
      price: 'C$ 300/ mes',
      features: [
        'Menú digital completo',
        'Productos ilimitados',
        'Personalización completa',
        'Soporte prioritario',
        'Códigos QR personalizados',
        'Estadísticas básicas',
      ],
      cta: 'Elegir Plan',
      highlighted: true,
    },
  ];

  // Métodos
  toggleFaq(index: number): void {
    this.faqs[index].isOpen = !this.faqs[index].isOpen;
  }

  submitContactForm(): void {
    this.contactoService
      .guardarContacto(this.contactForm)
      .then(() => {
        alert('¡Gracias por contactarnos! Te responderemos a la brevedad.');
        this.contactForm = {
          name: '',
          email: '',
          phone: '',
          businessName: '',
          message: '',
          fechaEnvio: new Date(),
        };
      })
      .catch((error) => {
        console.error('Error al enviar el formulario', error);
        alert('Hubo un error al enviar el mensaje. Intenta nuevamente.');
      });
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
