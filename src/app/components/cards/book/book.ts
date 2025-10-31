import { Component, Input } from '@angular/core';
import { BookModel } from '../../../models/book-model';
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: 'app-book',
  imports: [RouterLink],
  templateUrl: './book.html',
  styleUrl: './book.css'
})
export class Book {

  constructor(private router: Router) {}

  @Input() data!: BookModel

  irParaDetalhes(){
    const slug = this.data.titulo?.nome?.toLowerCase().replaceAll(' ', '-') || '';
    this.router.navigate(['./livros', slug], {state: this.data})
  }

  // Helpers used by template to avoid complex expressions
  getAuthors(): string {
    return this.data?.titulo?.autores?.map(a => a.nome).join(', ') || 'Desconhecido';
  }

  getCategories(): string {
    return this.data?.titulo?.categorias?.map(c => c.nome).join(', ') || '';
  }

  getYear(): string {
    return this.data?.dtPublicacao ? this.data.dtPublicacao.slice(0,4) : '';
  }

}
