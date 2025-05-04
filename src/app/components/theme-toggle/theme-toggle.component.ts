import { Component, OnInit } from '@angular/core';
import { ThemeService, Theme } from "../../services/theme.service"

@Component({
  selector: 'app-theme-toggle',
  standalone: false,
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.css'
})
export class ThemeToggleComponent implements OnInit {
  currentTheme: Theme = "light"

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService.theme$.subscribe((theme) => {
      this.currentTheme = theme
    })
  }

  toggleTheme(): void {
    this.themeService.toggleTheme()
  }
}
