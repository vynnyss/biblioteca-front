import { Component, OnInit, } from '@angular/core';
import { BookModel } from '../../models/bookI-model';

@Component({
  selector: 'app-book-details',
  imports: [],
  templateUrl: './book-details.html',
  styleUrl: './book-details.css'
})
export class BookDetails implements OnInit {

  public livro!: BookModel;

  ngOnInit(): void {
      this.livro = history.state
  }
  addToCart(): void {
    console.log("adicionado ao carrinho com sucesso!")
  }
}
