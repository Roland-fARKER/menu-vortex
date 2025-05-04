import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User, Business } from '../../../models/auth.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  currentStep = 1;
  totalSteps = 2;
  isLoading = false;
  errorMessage: string | null = null;

  // Formularios para cada paso
  ownerForm: FormGroup;
  businessForm: FormGroup;

  // Control de visibilidad de contraseñas
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Inicializar formulario de propietario
    this.ownerForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        phone: [
          '',
          [Validators.required, Validators.pattern(/^\+?[0-9\s\-$$$$]+$/)],
        ],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );

    // Inicializar formulario de negocio
    this.businessForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      socialMedia: this.fb.group({
        facebook: [''],
        instagram: [''],
        twitter: [''],
        website: [''],
      }),
      location: this.fb.group({
        lat: [19.4326, [Validators.required]],
        lng: [-99.1332, [Validators.required]],
        address: [''],
      }),
    });
  }

  ngOnInit(): void {
    // Verificar si el usuario ya está autenticado
    this.authService.authState$.subscribe((state) => {
      this.isLoading = state.isLoading;

      if (state.isAuthenticated) {
        this.router.navigate(['/admin/dashboard']);
      }
    });
  }

  // Validador personalizado para verificar que las contraseñas coincidan
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  nextStep(): void {
    if (this.currentStep === 1 && this.ownerForm.valid) {
      this.currentStep++;
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onSubmit(): void {
    if (this.ownerForm.valid && this.businessForm.valid) {
      this.isLoading = true;

      // Crear objetos de usuario y negocio
      const user: User = {
        name: this.ownerForm.value.name,
        email: this.ownerForm.value.email,
        phone: this.ownerForm.value.phone,
        password: this.ownerForm.value.password,
        role: 'owner',
      };

      const business: Business = {
        ownerId: '', // Se asignará en el servicio
        name: this.businessForm.value.name,
        description: this.businessForm.value.description,
        location: this.businessForm.value.location,
        socialMedia: this.businessForm.value.socialMedia,
      };

      // Registrar usuario y negocio
      this.authService.register(user, business).subscribe({
        next: () => {
          this.router.navigate(['/admin/dashboard']);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.message || 'Error al registrar';
        },
      });
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      if (this.currentStep === 1) {
        this.markFormGroupTouched(this.ownerForm);
      } else {
        this.markFormGroupTouched(this.businessForm);
      }
    }
  }

  togglePasswordVisibility(field: 'password' | 'confirmPassword'): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  // Método auxiliar para marcar todos los campos como tocados
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
