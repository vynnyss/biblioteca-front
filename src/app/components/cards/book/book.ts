import { Component, Input } from '@angular/core';
import { BookModel } from '../../../models/bookI-model';

@Component({
  selector: 'app-book',
  imports: [],
  templateUrl: './book.html',
  styleUrl: './book.css'
})
export class Book {

  @Input() data!: BookModel

}
