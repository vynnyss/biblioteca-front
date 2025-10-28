import { Component, Input } from '@angular/core';
import { BookModel } from '../../../models/bookI-model';

@Component({
  selector: 'app-itens-carrinho',
  imports: [],
  templateUrl: './itens-carrinho.html',
  styleUrl: './itens-carrinho.css'
})
export class ItensCarrinho {
  @Input() data!: BookModel
}
