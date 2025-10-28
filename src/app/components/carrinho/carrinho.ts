import { Component } from '@angular/core';
import { ItensCarrinho } from '../cards/itens-carrinho/itens-carrinho';

@Component({
  selector: 'app-carrinho',
  imports: [ItensCarrinho],
  templateUrl: './carrinho.html',
  styleUrl: './carrinho.css'
})
export class Carrinho {
  public mockBooks = [
            {
                id: 1,
                title: "The Great Gatsby",
                author: "F. Scott Fitzgerald",
                genre: "Classic Literature",
                year: 1925,
                isbn: "978-0-7432-7356-5",
                description: "A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream.",
                cover: "great-gatsby-book-cover.png",
            },
            {
                id: 2,
                title: "To Kill a Mockingbird",
                author: "Harper Lee",
                genre: "Classic Literature",
                year: 1960,
                isbn: "978-0-06-112008-4",
                description: "A gripping tale of racial injustice and childhood innocence in the American South.",
                cover: "to-kill-a-mockingbird-cover.png",
            },
            {
                id: 3,
                title: "1984",
                author: "George Orwell",
                genre: "Science Fiction",
                year: 1949,
                isbn: "978-0-452-28423-4",
                description: "A dystopian social science fiction novel about totalitarian control and surveillance.",
                cover: "1984-book-cover.png",
            },
            {
                id: 4,
                title: "Pride and Prejudice",
                author: "Jane Austen",
                genre: "Romance",
                year: 1813,
                isbn: "978-0-14-143951-8",
                description: "A romantic novel that critiques the British landed gentry at the end of the 18th century.",
                cover: "pride-and-prejudice-cover.png",
            },
            {
                id: 5,
                title: "The Catcher in the Rye",
                author: "J.D. Salinger",
                genre: "Coming of Age",
                year: 1951,
                isbn: "978-0-316-76948-0",
                description: "A controversial novel about teenage rebellion and alienation in post-war America.",
                cover: "catcher-in-the-rye-cover.png",
            },
            {
                id: 6,
                title: "Dune",
                author: "Frank Herbert",
                genre: "Science Fiction",
                year: 1965,
                isbn: "978-0-441-17271-9",
                description: "An epic science fiction novel set in a distant future amidst a feudal interstellar society.",
                cover: "dune-frank-herbert-book-cover.jpg",
            }
        ]

   public quantidadeLivros = this.mockBooks.length
}
