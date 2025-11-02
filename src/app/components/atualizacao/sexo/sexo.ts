import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sexo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sexo.html',
  styleUrls: ['./sexo.css']
})
export class Sexo {
  sexoValue: string = '';

  cancelar(): void {
    if (typeof window !== 'undefined' && window.history && window.history.length > 0) {
      window.history.back();
    }
  }

}
