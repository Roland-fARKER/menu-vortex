import { Component } from '@angular/core';
import { Business, User } from '../../../models/auth.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  user: User | null = null
  business: Business | null = null
  
  userForm: FormGroup
  businessForm: FormGroup
  passwordForm: FormGroup
  
  activeTab = "personal"
  isLoading = false
  successMessage = ""
  errorMessage = ""
  
  showCurrentPassword = false
  showNewPassword = false
  showConfirmPassword = false

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
  ) {
    // Inicializar formularios vacíos
    this.userForm = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(3)]],
      email: ["", [Validators.required, Validators.email]],
      phone: ["", [Validators.required, Validators.pattern(/^\+?[0-9\s\-()]+$/)]],
    })

    this.businessForm = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(3)]],
      description: [""],
      socialMedia: this.fb.group({
        facebook: [""],
        instagram: [""],
        twitter: [""],
        website: [""],
      }),
      location: this.fb.group({
        lat: [0, [Validators.required]],
        lng: [0, [Validators.required]],
        address: [""],
      }),
    })

    this.passwordForm = this.fb.group(
      {
        currentPassword: ["", [Validators.required]],
        newPassword: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", [Validators.required]],
      },
      { validators: this.passwordMatchValidator },
    )
  }

  ngOnInit(): void {
    this.authService.authState$.subscribe((state) => {
      this.user = state.user
      this.business = state.business

      // Actualizar formularios con datos existentes
      if (this.user) {
        this.userForm.patchValue({
          name: this.user.name,
          email: this.user.email,
          phone: this.user.phone,
        })
      }

      if (this.business) {
        this.businessForm.patchValue({
          name: this.business.name,
          description: this.business.description || "",
          socialMedia: {
            facebook: this.business.socialMedia?.facebook || "",
            instagram: this.business.socialMedia?.instagram || "",
            twitter: this.business.socialMedia?.twitter || "",
            website: this.business.socialMedia?.website || "",
          },
          location: {
            lat: this.business.location.lat,
            lng: this.business.location.lng,
            address: this.business.location.address || "",
          },
        })
      }
    })
  }

  // Validador personalizado para verificar que las contraseñas coincidan
  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get("newPassword")?.value
    const confirmPassword = form.get("confirmPassword")?.value

    if (newPassword !== confirmPassword) {
      form.get("confirmPassword")?.setErrors({ passwordMismatch: true })
      return { passwordMismatch: true }
    }

    return null
  }

  changeTab(tab: string): void {
    this.activeTab = tab
    this.clearMessages()
  }

  clearMessages(): void {
    this.successMessage = ""
    this.errorMessage = ""
  }

  updateUserProfile(): void {
    if (this.userForm.valid) {
      this.isLoading = true
      this.clearMessages()

      this.authService.updateUserProfile(this.userForm.value).subscribe({
        next: (updatedUser) => {
          this.isLoading = false
          this.successMessage = "Información personal actualizada correctamente"
        },
        error: (err) => {
          this.isLoading = false
          this.errorMessage = "Error al actualizar la información personal"
          console.error(err)
        },
      })
    }
  }

  updateBusinessProfile(): void {
    if (this.businessForm.valid) {
      this.isLoading = true
      this.clearMessages()

      this.authService.updateBusinessProfile(this.businessForm.value).subscribe({
        next: (updatedBusiness) => {
          this.isLoading = false
          this.successMessage = "Información del negocio actualizada correctamente"
        },
        error: (err) => {
          this.isLoading = false
          this.errorMessage = "Error al actualizar la información del negocio"
          console.error(err)
        },
      })
    }
  }

  changePassword(): void {
    if (this.passwordForm.valid) {
      this.isLoading = true;
      this.clearMessages();
  
      const currentPassword = this.passwordForm.value.currentPassword;
      const newPassword = this.passwordForm.value.newPassword;
  
      this.authService.changePassword(currentPassword, newPassword).subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = "Contraseña actualizada correctamente";
          this.passwordForm.reset();
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = `Error al cambiar la contraseña: ${err.message}`;
        },
      });
    }
  }

  togglePasswordVisibility(field: "current" | "new" | "confirm"): void {
    if (field === "current") {
      this.showCurrentPassword = !this.showCurrentPassword
    } else if (field === "new") {
      this.showNewPassword = !this.showNewPassword
    } else {
      this.showConfirmPassword = !this.showConfirmPassword
    }
  }
}
