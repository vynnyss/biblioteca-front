import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-email',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './email.html',
  styleUrls: ['./email.css']
})
export class Email {
  emailValue: string = '';

  cancelar(): void {
    if (typeof window !== 'undefined' && window.history && window.history.length > 0) {
      window.history.back();
    }
  }
    
  salvar(): void {
   
    const value = (this.emailValue || '').trim();
    if (!value) {
      alert('Informe um e-mail válido antes de salvar.');
      return;
    }
        
    console.log('E-mail salvo:', value);
   
    alert('E-mail salvo: ' + value);
  }
}
