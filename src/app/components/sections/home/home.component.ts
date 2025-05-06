import { Component, Input } from '@angular/core';

@Component({
  selector: 'home-section',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  @Input({required: true}) isDarkMode: boolean = false;
}
