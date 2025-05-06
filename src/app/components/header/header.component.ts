import { AfterContentInit, AfterViewInit, Component, ContentChildren, ElementRef, Inject, Input, PLATFORM_ID, QueryList, ViewChild } from '@angular/core';
import { HeaderItemComponent } from './header-item/header-item.component';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'custom-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements AfterContentInit, AfterViewInit {
  @ContentChildren(HeaderItemComponent) items!: QueryList<HeaderItemComponent>;
  @ViewChild('navbar', { static: true }) navbar!: ElementRef;
  @Input() autoScrollSections: boolean = false;

  private _activeItemIndex = 0;
  private isAutomaticScroll = false;
  private scrollMargin = 16;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngAfterContentInit() {
    this.items.forEach((item, index) => {
      item.itemClicked.subscribe((elementSection: HTMLDivElement | null) => {
        if (this._activeItemIndex === index) return;
        this.activateItem(index)
        this.scrollToActiveItem();
        if (this.autoScrollSections && elementSection) {
          this.isAutomaticScroll = true;
          elementSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId) && this.autoScrollSections) {
      const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
      };
      const observer = new IntersectionObserver((entries) => this.handleIntersection(entries), options);
      this.items
        .map(item => item.sectionElement)
        .forEach((section: HTMLDivElement | null) => {
          if (section) observer.observe(section);
        });
    }
  }

  private handleIntersection(entries: IntersectionObserverEntry[]) {
    if (this.isAutomaticScroll) this.handleIntersectionWithAutomaticScroll(entries);
    else this.handleIntersectionWithManualScroll(entries);
  }

  private handleIntersectionWithAutomaticScroll(entries: IntersectionObserverEntry[]) {
    entries.forEach(entry => {
      const section = entry.target as HTMLElement;
      if (entry.isIntersecting && section) {
        const itemIndex = this.items.toArray().findIndex(item => item.sectionElement && item.sectionElement === section);
        if (itemIndex !== -1 && this._activeItemIndex === itemIndex) this.isAutomaticScroll = false;
      }
    })
  }

  private handleIntersectionWithManualScroll(entries: IntersectionObserverEntry[]) {
    entries.forEach(entry => {
      const section = entry.target as HTMLElement;
      if (entry.isIntersecting && section) {
        const itemIndex = this.items.toArray().findIndex(item => item.sectionElement && item.sectionElement === section);
        if (itemIndex !== -1) {
          this.activateItem(itemIndex);
          this.scrollToActiveItem();
        }
      }
    });
  }

  private activateItem(index: number) {
    this.items.get(this._activeItemIndex)!.isActive = false;
    this.items.get(index)!.isActive = true;
    this._activeItemIndex = index;
  }

  private scrollToActiveItem() {
    if (this.navbar && this.items) {
      const activeItem = this.items.get(this._activeItemIndex);

      if (activeItem) {
        const navbarElement = this.navbar.nativeElement; // Accede al DOM del navbar
        const itemElement = activeItem.elementRef.nativeElement; // Accede al DOM del item activo

        const navbarRect = navbarElement.getBoundingClientRect();
        const itemRect = itemElement.getBoundingClientRect();

        const moveRight = this.isRightEdgeVisible(itemRect, navbarRect);
        const moveLeft = this.isLeftEdgeVisible(itemRect, navbarRect);

        if (moveRight || moveLeft) {
          const offsetLeft = itemElement.offsetLeft;
          const offsetRight = offsetLeft + itemElement.offsetWidth;
          const navbarWidth = navbarElement.clientWidth;

          if (moveLeft) {
            navbarElement.scrollTo({ left: offsetLeft - this.scrollMargin, behavior: 'smooth' });
          } else {
            navbarElement.scrollTo({ left: offsetRight - navbarWidth + this.scrollMargin, behavior: 'smooth' });
          }
        }
      }
    }
  }

  private isRightEdgeVisible(itemRect: DOMRect, navbarRect: DOMRect): boolean {
    return itemRect.right + this.scrollMargin > navbarRect.right;
  }

  private isLeftEdgeVisible(itemRect: DOMRect, navbarRect: DOMRect): boolean {
    return itemRect.left < this.scrollMargin;
  }
}
