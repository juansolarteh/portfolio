import { AfterViewInit, Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { HeaderItemComponent } from './components/header/header-item/header-item.component';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, HeaderItemComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, AfterViewInit {
  shownSection = 0;
  isDarkMode!: boolean;
  private isAutomaticScroll = false;
  private scrollTimeout: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    if (this.isBrowser()) {
      this.isDarkMode = document.body.classList.contains('dark-mode');
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
        document.body.classList.toggle('dark-mode', event.matches);
        this.isDarkMode = event.matches;
      });
    }
  }

  ngAfterViewInit(): void {
    if (this.isBrowser()) {
      this.setupIntersectionObserver();
    }
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-mode', this.isDarkMode);
  }

  scrollToSection(index: number) {
    this.shownSection = index;
    let sectionId = '';
    switch (index) {
      case 0:
        sectionId = 'home-section';
        break;
      case 1:
        sectionId = 'about-section';
        break;
      case 2:
        sectionId = 'skills-section';
        break;
      case 3:
        sectionId = 'projects-section';
        break;
    }
    const section = document.getElementById(sectionId);
    if (section) {
      this.isAutomaticScroll = true;
      section.scrollIntoView({ behavior: 'smooth' });
      this.detectScrollEnd();
    }
  }

  private setupIntersectionObserver() {
    const sections = document.querySelectorAll('.section');
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
      if (this.isAutomaticScroll) return
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          switch (sectionId) {
            case 'home-section':
              this.shownSection = 0;
              break;
            case 'about-section':
              this.shownSection = 1;
              break;
            case 'skills-section':
              this.shownSection = 2;
              break;
            case 'projects-section':
              this.shownSection = 3;
              break;
          }
        }
      });
    }, options);

    sections.forEach(section => {
      observer.observe(section);
    });
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
    this.scrollTimeout = setTimeout(() => {
      this.onScrollEnd();
    }, 150); // Ajusta el tiempo según sea necesario
  }

  private detectScrollEnd() {
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
    this.scrollTimeout = setTimeout(() => {
      this.onScrollEnd();
    }, 150);
  }

  private onScrollEnd() {
    this.isAutomaticScroll = false;
  }
}
