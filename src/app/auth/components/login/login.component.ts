import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private themeService: ThemeService,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });

    // Suscribirse al estado de autenticación
    this.authService.authState$.subscribe((state) => {
      this.isLoading = state.isLoading;
      this.errorMessage = state.error;

      // Redirigir si ya está autenticado
      if (state.isAuthenticated) {
        this.router.navigate(['/admin/dashboard']);
      }
    });
  }

  ngOnInit(): void {
    // Aplicar el tema actual al body para que afecte a este componente
    this.themeService.theme$.subscribe((theme) => {
      document.body.classList.remove("light-theme", "dark-theme")
      document.body.classList.add(`${theme}-theme`)
    })
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: () => {
          // La redirección se maneja en la suscripción al authState$
        },
        error: (err) => {
          this.errorMessage = err.message || 'Error al iniciar sesión';
        },
      });
    } else {
      this.markFormGroupTouched(this.loginForm);
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
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
