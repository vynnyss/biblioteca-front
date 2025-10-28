import { Component, Input } from '@angular/core';
import { BookModel } from '../../../models/bookI-model';
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
    this.router.navigate(['./livros', this.data.title.toLowerCase().replaceAll(' ', '-')], {state: this.data})
  }

}
