import { Component, OnInit } from '@angular/core';
import { Book } from '../cards/book/book';
import { GetServicos } from '../../servicos/api/get-servicos';
import { BookModel } from '../../models/book-model';

@Component({
  selector: 'app-home',
  imports: [Book],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  public books: BookModel[] = [];
  constructor(private getServicos: GetServicos) {}

  ngOnInit(): void {
    this.getServicos.getApiUrlGetEdicoesAtivas().subscribe((data) => {
      console.log('Home: loaded books', data);
      this.books = data;
    });
  }
}
