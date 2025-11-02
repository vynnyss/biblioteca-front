import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cpf',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cpf.html',
  styleUrls: ['./cpf.css']
})
export class Cpf {

  cpfValue: string = '';

  cancelar(): void {
    if (typeof window !== 'undefined' && window.history && window.history.length > 0) {
      window.history.back();
    }
  }

  mascaraCPF(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input) return;
    let v = input.value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    // apply mask 000.000.000-00
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
    v = v.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
    input.value = v;
  }

}
