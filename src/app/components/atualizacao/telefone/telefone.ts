import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-telefone',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './telefone.html',
  styleUrls: ['./telefone.css']
})
export class Telefone {
  telefoneValue: string = '';

  cancelar(): void {
    if (typeof window !== 'undefined' && window.history && window.history.length > 0) {
      window.history.back();
    }
  }

  salvar(): void {
    const tel = (this.telefoneValue || '').trim();
    if (!tel) {
      alert('Informe um telefone antes de salvar.');
      return;
    }
    console.log('Telefone salvo:', { telefone: tel });
   
    alert('Telefone salvo: ' + tel);
  }

}
