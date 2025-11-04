import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PessoaModel } from '../../../../../models/pessoa-model';

@Component({
  selector: 'app-detalhes-cliente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalhes-cliente.html',
  styleUrls: ['./detalhes-cliente.css']
})
export class DetalhesCliente {
  @Input() cliente: PessoaModel | null = null;
  @Output() close = new EventEmitter<void>();

  public onClose() {
    this.close.emit();
  }
}
