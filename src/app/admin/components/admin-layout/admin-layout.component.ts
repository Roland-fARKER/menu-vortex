import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from '../../../auth/services/auth.service';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-admin-layout',
  standalone: false,
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent implements OnInit {
  userName = ""
  businessName = ""
  isSidebarCollapsed = false
  isMobile = false
  showMobileMenu = false

  constructor(
    private authService: AuthService,
    private themeService: ThemeService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // this.authService.authState$.subscribe((state) => {
    //   if (!state.isAuthenticated) {
    //     this.router.navigate(["/auth/login"])
    //     return
    //   }

    //   this.userName = state.user?.name || ""
    //   this.businessName = state.business?.name || ""
    // })

    // Detectar si es móvil
    this.checkIfMobile()
    window.addEventListener("resize", () => this.checkIfMobile())
  }

  checkIfMobile(): void {
    this.isMobile = window.innerWidth < 768
    if (this.isMobile) {
      this.isSidebarCollapsed = true
    }
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed
  }

  toggleMobileMenu(): void {
    this.showMobileMenu = !this.showMobileMenu
  }

  logout(): void {
    this.authService.logout()
    this.router.navigate(["/home"])
  }

  closeMobileMenuIfNeeded() {
    if (this.isMobile) {
      this.showMobileMenu = false;
    }
  }
}
