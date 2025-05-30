import {
  Component,
  type OnInit,
  ViewChild,
  type ElementRef,
} from '@angular/core';
import {
  FormBuilder,
  type FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { AuthService } from '../../../auth/services/auth.service';
import {
  Storage,
  ref,
  uploadBytes,
  getDownloadURL,
} from '@angular/fire/storage';
import { Business } from '../../../models/business.model';
import { User } from '../../../models/auth.model';
import { ImageOptimizationService } from '../../../services/imageOptimization.service';
@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  @ViewChild('logoInput') logoInput!: ElementRef<HTMLInputElement>;
  @ViewChild('bannerInput') bannerInput!: ElementRef<HTMLInputElement>;

  user: User | null = null;
  business: Business | null = null;

  userForm: FormGroup;
  businessForm: FormGroup;
  passwordForm: FormGroup;

  activeTab = 'personal';
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  // Para la previsualización de imágenes
  logoPreview: string | null = null;
  bannerPreview: string | null = null;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private storage: Storage,
    private imageOptimizationService: ImageOptimizationService
  ) {
    // Inicializar formularios vacíos
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [
        '',
        [Validators.required, Validators.pattern(/^\+?[0-9\s\-()]+$/)],
      ],
    });

    this.businessForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      logo: [''],
      coverImage: [''],
      whatsapp: [''],
      socialMedia: this.fb.group({
        facebook: [''],
        instagram: [''],
        twitter: [''],
        website: [''],
      }),
      location: this.fb.group({
        lat: [0, [Validators.required]],
        lng: [0, [Validators.required]],
        address: [''],
      }),
    });

    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    this.authService.authState$.subscribe((state) => {
      this.user = state.user;
      this.business = state.business;

      // Actualizar formularios con datos existentes
      if (this.user) {
        this.userForm.patchValue({
          name: this.user.name,
          email: this.user.email,
          phone: this.user.phone,
        });
      }

      if (this.business) {
        this.businessForm.patchValue({
          name: this.business.name,
          description: this.business.description || '',
          whatsapp: this.business.whatsapp || '',
          socialMedia: {
            facebook: this.business.socialMedia?.facebook || '',
            instagram: this.business.socialMedia?.instagram || '',
            twitter: this.business.socialMedia?.twitter || '',
            website: this.business.socialMedia?.website || '',
          },
          location: {
            lat: this.business.location.lat,
            lng: this.business.location.lng,
            address: this.business.location.address || '',
          },
        });

        // Establecer las previsualizaciones de imágenes
        this.logoPreview = this.business.logo || null;
        this.bannerPreview = this.business.coverImage || null;
      }
    });
  }

  // Validador personalizado para verificar que las contraseñas coincidan
  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (newPassword !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  changeTab(tab: string): void {
    this.activeTab = tab;
    this.clearMessages();
  }

  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }

  updateUserProfile(): void {
    if (this.userForm.valid) {
      this.isLoading = true;
      this.clearMessages();

      this.authService.updateUserProfile(this.userForm.value).subscribe({
        next: (updatedUser) => {
          this.isLoading = false;
          this.successMessage =
            'Información personal actualizada correctamente';
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = 'Error al actualizar la información personal';
          console.error(err);
        },
      });
    }
  }

  updateBusinessProfile(): void {
    if (this.businessForm.valid) {
      this.isLoading = true;
      this.clearMessages();

      // Asegurarse de que las imágenes se incluyan
      const businessData = this.businessForm.value;
      businessData.logo = this.logoPreview;
      businessData.coverImage = this.bannerPreview;

      console.log('Datos del negocio a actualizar:', businessData);
      this.authService.updateBusinessProfile(businessData).subscribe({
        next: (updatedBusiness) => {
          this.isLoading = false;
          this.successMessage =
            'Información del negocio actualizada correctamente';
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = 'Error al actualizar la información del negocio';
          console.error(err);
        },
      });
    }
  }

  changePassword(): void {
    if (this.passwordForm.valid) {
      this.isLoading = true;
      this.clearMessages();

      // Simulación de cambio de contraseña
      setTimeout(() => {
        this.isLoading = false;
        this.successMessage = 'Contraseña actualizada correctamente';
        this.passwordForm.reset();
      }, 1000);
    }
  }

  togglePasswordVisibility(field: 'current' | 'new' | 'confirm'): void {
    if (field === 'current') {
      this.showCurrentPassword = !this.showCurrentPassword;
    } else if (field === 'new') {
      this.showNewPassword = !this.showNewPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  // Métodos para manejar la carga de imágenes
  onLogoClick(): void {
    this.logoInput.nativeElement.click();
  }

  onBannerClick(): void {
    this.bannerInput.nativeElement.click();
  }

  async onLogoChange(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecciona un archivo de imagen válido.');
        return;
      }

      try {
        // Optimizar imagen antes de subir
        const optimizedFile =
          await this.imageOptimizationService.optimizeImageToWebp(file);

        // Mostrar previsualización usando el archivo optimizado
        this.logoPreview = URL.createObjectURL(optimizedFile);

        // Subir la imagen optimizada
        const downloadURL = await this.uploadImage(
          optimizedFile,
          'negocios/logo'
        );
        this.logoPreview = downloadURL;
        this.businessForm.patchValue({ logo: downloadURL });
      } catch (error) {
        console.error('Error al optimizar o subir el logo:', error);
        alert('Hubo un error al procesar el logo.');
      }
    }
  }

  async onBannerChange(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecciona un archivo de imagen válido.');
      return;
    }

    try {
      // Optimizar imagen antes de subir
      const optimizedFile = await this.imageOptimizationService.optimizeImageToWebp(file);

      // Mostrar previsualización usando el archivo optimizado
      this.bannerPreview = URL.createObjectURL(optimizedFile);

      // Subir la imagen optimizada
      const downloadURL = await this.uploadImage(optimizedFile, 'negocios/banner');
      this.bannerPreview = downloadURL;
      this.businessForm.patchValue({ coverImage: downloadURL });
    } catch (error) {
      console.error('Error al optimizar o subir el banner:', error);
      alert('Hubo un error al procesar el banner.');
    }
  }
}

  async uploadImage(file: File, path: string): Promise<string> {
    const timestamp = Date.now();
    const filePath = `${path}/${timestamp}_${file.name}`;
    const storageRef = ref(this.storage, filePath);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  }
}
