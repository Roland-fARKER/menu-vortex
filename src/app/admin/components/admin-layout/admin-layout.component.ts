import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { ThemeService } from '../../../services/theme.service';
import { BusinessInfoService } from '../../../services/business.info.service';
import { Business } from '../../../models/business.model';


@Component({
  selector: 'app-admin-layout',
  standalone: false,
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css',
})
export class AdminLayoutComponent implements OnInit {
  userName = '';
  businessName = '';
  isSidebarCollapsed = false;
  isMobile = false;
  showMobileMenu = false;
  business: Business | null = null;
  slug: string = '';

  constructor(
    private authService: AuthService,
    private themeService: ThemeService,
    private router: Router,
    private route: ActivatedRoute,
    private businessService: BusinessInfoService
  ) {}

  ngOnInit(): void {
    this.authService.authState$.subscribe((state) => {
      if (!state.isAuthenticated) {
        this.router.navigate(['/auth/login']);
        return;
      }

      this.userName = state.user?.name || '';
      this.businessName = state.business?.name || '';
    });

    // ✅ Obtener slug desde la URL
    this.slug = this.route.snapshot.paramMap.get('slug') || '';
    if (this.slug) {
      this.businessService.getBusinessBySlug(this.slug).subscribe((business) => {
        this.business = business;
        if (business) {
          this.businessService.setBusiness(business); // Compartir a hijos
        }
      });
    }

    // Detectar si es móvil
    this.checkIfMobile();
    window.addEventListener('resize', () => this.checkIfMobile());
  }

  checkIfMobile(): void {
    this.isMobile = window.innerWidth < 768;
    if (this.isMobile) {
      this.isSidebarCollapsed = true;
    }
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  toggleMobileMenu(): void {
    this.showMobileMenu = !this.showMobileMenu;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  closeMobileMenuIfNeeded() {
    if (this.isMobile) {
      this.showMobileMenu = false;
    }
  }
}
