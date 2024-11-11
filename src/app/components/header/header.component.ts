import { AfterContentInit, Component, ContentChildren, ElementRef, EventEmitter, Input, Output, QueryList } from '@angular/core';
import { HeaderItemComponent } from './header-item/header-item.component';

@Component({
  selector: 'custom-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements AfterContentInit{
  @ContentChildren(HeaderItemComponent) items!: QueryList<HeaderItemComponent>;
  @Output() changeItem = new EventEmitter<number>();

  private _activeItemIndex = 0;
  
  @Input()
  set activeItemIndex(index: number) {
    if (this.items && this.items.length > index) {
      this.activateItem(index);
      this._activeItemIndex = index;
    }
  }

  get activeItemIndex(): number {
    return this._activeItemIndex;
  }

  ngAfterContentInit() {
    this.items.forEach((item, index) => {
      item.itemClicked.subscribe(() => {
        this.activateItem(index)
        this._activeItemIndex = index;
        this.changeItem.emit(index);
      });
    });
    
    this.activateItem(this._activeItemIndex);
  }

  activateItem(index: number) {
    this.items.get(this._activeItemIndex)!.isActive = false;
    this.items.get(index)!.isActive = true;
  }
}
