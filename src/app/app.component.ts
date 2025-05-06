import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { HeaderItemComponent } from './components/header/header-item/header-item.component';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HomeComponent } from "./components/sections/home/home.component";
import { AboutComponent } from "./components/sections/about/about.component";
import { ResponsiveService } from './services/responsive.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, HeaderItemComponent, HomeComponent, AboutComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  shownSection = 0;
  isDarkMode!: boolean;
  isMobile!: boolean;
  email = "juanpablosh@unicauca.edu.co";

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private responsiveSvc: ResponsiveService) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isDarkMode = document.body.classList.contains('dark-mode');
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
        document.body.classList.toggle('dark-mode', event.matches);
        this.isDarkMode = event.matches;
      });
      this.responsiveSvc.isMobile$.subscribe(isMobile => this.isMobile = isMobile)
    }
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-mode', this.isDarkMode);
  }

  copyEmail() {
    navigator.clipboard.writeText(this.email);
  }

  sendMessage() {
    const email = this.email;
    const subject = encodeURIComponent('Hello');
    const body = encodeURIComponent('I saw your portfolio and...');
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  }
}