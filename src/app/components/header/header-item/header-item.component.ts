import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'header-item',
  standalone: true,
  imports: [],
  templateUrl: './header-item.component.html',
  styleUrl: './header-item.component.css'
})
export class HeaderItemComponent {
  @Input() isActive = false;
  @Output() itemClicked = new EventEmitter<void>();

  handleOnClick() {
    this.itemClicked.emit();
  }
}
