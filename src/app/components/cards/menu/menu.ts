import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-menu',
  imports: [],
  templateUrl: './menu.html',
  styleUrl: './menu.css'
})
export class Menu {
  @Input() cardName !: string

  public get cardPath(): string {
    if (!this.cardName) {
      return '';
    }
    
    return this.cardName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  public get fullPath(): string {
    return `components/${this.cardPath}`;
  }
}
