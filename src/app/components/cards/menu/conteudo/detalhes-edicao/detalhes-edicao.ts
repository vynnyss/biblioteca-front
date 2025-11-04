import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookModel } from '../../../../../models/book-model';
import { ListaExemplares } from '../lista-exemplares/lista-exemplares';

@Component({
  selector: 'app-detalhes-edicao',
  standalone: true,
  imports: [CommonModule, ListaExemplares],
  templateUrl: './detalhes-edicao.html',
  styleUrl: './detalhes-edicao.css'
})
export class DetalhesEdicao {
  @Input() edicao: BookModel | null = null;
  @Output() close = new EventEmitter<void>();

  public onClose() {
    this.close.emit();
  }

  // Presentation helpers (mirror those in BookDetails)
  public getAuthor(): string {
    return this.edicao?.titulo?.autores?.[0]?.nome || 'Desconhecido';
  }

  public getYear(): string {
    return this.edicao?.dtPublicacao ? this.edicao.dtPublicacao.slice(0,4) : '';
  }

  public getCategories(): string {
    return this.edicao?.titulo?.categorias?.map((c: any) => c.nome).join(', ') || '';
  }
}
