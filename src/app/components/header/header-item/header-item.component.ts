import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'header-item',
  standalone: true,
  imports: [],
  templateUrl: './header-item.component.html',
  styleUrl: './header-item.component.css'
})
export class HeaderItemComponent {
  @Input() isActive = false;
  @Input() sectionElement: HTMLDivElement | null = null;
  @Output() itemClicked = new EventEmitter<HTMLDivElement | null>();

  constructor(public elementRef: ElementRef) {}

  handleOnClick() {
    this.itemClicked.emit(this.sectionElement);
  }
}
