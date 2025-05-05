import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-settigns',
  standalone: false,
  templateUrl: './settigns.component.html',
  styleUrl: './settigns.component.css',
})
export class SettignsComponent {
  generalForm: FormGroup;
  displayForm: FormGroup;
  notificationsForm: FormGroup;
  privacyForm: FormGroup;

  activeSection: 'general' | 'display' | 'notifications' | 'privacy' =
    'general';

  isLoading = false;
  saveSuccess = false;
  currentTheme: 'light' | 'dark' = 'light';

  // Opciones para selects
  languages = [
    { value: 'es', label: 'Español' },
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'Français' },
    { value: 'pt', label: 'Português' },
  ];

  currencies = [
    { value: 'MXN', label: 'Peso Mexicano (MXN)' },
    { value: 'USD', label: 'Dólar Estadounidense (USD)' },
    { value: 'EUR', label: 'Euro (EUR)' },
    { value: 'COP', label: 'Peso Colombiano (COP)' },
    { value: 'ARS', label: 'Peso Argentino (ARS)' },
  ];

  menuLayouts = [
    { value: 'grid', label: 'Cuadrícula' },
    { value: 'list', label: 'Lista' },
    { value: 'compact', label: 'Compacto' },
  ];

  constructor(private fb: FormBuilder, private themeService: ThemeService) {
    // Inicializar formularios
    this.generalForm = this.fb.group({
      businessName: ['Mi Restaurante'],
      language: ['es'],
      currency: ['MXN'],
      timeZone: ['America/Mexico_City'],
      orderPrefix: ['ORD-'],
    });

    this.displayForm = this.fb.group({
      menuLayout: ['grid'],
      showPrices: [true],
      showImages: [true],
      showDescriptions: [true],
      enableAnimations: [true],
      itemsPerPage: [12],
      enableFeaturedItems: [true],
    });

    this.notificationsForm = this.fb.group({
      enableEmailNotifications: [true],
      enablePushNotifications: [false],
      notifyOnNewOrder: [true],
      notifyOnCancelledOrder: [true],
      notifyOnLowStock: [true],
      dailySummary: [false],
    });

    this.privacyForm = this.fb.group({
      collectAnalytics: [true],
      shareDataWithPartners: [false],
      storeCustomerData: [true],
      cookieConsent: [true],
      dataRetentionDays: [90],
    });
  }

  ngOnInit(): void {
    // Obtener tema actual
    this.themeService.theme$.subscribe((theme) => {
      this.currentTheme = theme;
    });

    // En un entorno real, aquí cargaríamos la configuración desde el backend
    // Por ahora, usamos valores predeterminados
  }

  setActiveSection(
    section: 'general' | 'display' | 'notifications' | 'privacy'
  ): void {
    this.activeSection = section;
  }

  saveSettings(): void {
    this.isLoading = true;
    this.saveSuccess = false;

    // Determinar qué formulario guardar según la sección activa
    let formToSave: FormGroup;

    switch (this.activeSection) {
      case 'general':
        formToSave = this.generalForm;
        break;
      case 'display':
        formToSave = this.displayForm;
        break;
      case 'notifications':
        formToSave = this.notificationsForm;
        break;
      case 'privacy':
        formToSave = this.privacyForm;
        break;
    }

    // Simulación de guardado
    setTimeout(() => {
      console.log(
        `Guardando configuración de ${this.activeSection}:`,
        formToSave.value
      );
      this.isLoading = false;
      this.saveSuccess = true;

      // Ocultar mensaje de éxito después de 3 segundos
      setTimeout(() => {
        this.saveSuccess = false;
      }, 3000);
    }, 800);
  }

  resetToDefaults(): void {
    if (
      confirm(
        '¿Estás seguro de que deseas restablecer la configuración a los valores predeterminados?'
      )
    ) {
      switch (this.activeSection) {
        case 'general':
          this.generalForm.reset({
            businessName: 'Mi Restaurante',
            language: 'es',
            currency: 'MXN',
            timeZone: 'America/Mexico_City',
            orderPrefix: 'ORD-',
          });
          break;
        case 'display':
          this.displayForm.reset({
            menuLayout: 'grid',
            showPrices: true,
            showImages: true,
            showDescriptions: true,
            enableAnimations: true,
            itemsPerPage: 12,
            enableFeaturedItems: true,
          });
          break;
        case 'notifications':
          this.notificationsForm.reset({
            enableEmailNotifications: true,
            enablePushNotifications: false,
            notifyOnNewOrder: true,
            notifyOnCancelledOrder: true,
            notifyOnLowStock: true,
            dailySummary: false,
          });
          break;
        case 'privacy':
          this.privacyForm.reset({
            collectAnalytics: true,
            shareDataWithPartners: false,
            storeCustomerData: true,
            cookieConsent: true,
            dataRetentionDays: 90,
          });
          break;
      }
    }
  }
}
