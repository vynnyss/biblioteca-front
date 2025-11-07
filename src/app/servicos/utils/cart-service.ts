import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
    private addedSubject = new Subject<void>();
    readonly added$ = this.addedSubject.asObservable();
    private changedSubject = new Subject<void>();
    readonly changed$ = this.changedSubject.asObservable();
  
    addToCart() {
      this.addedSubject.next();
    }

    // Notifica alterações no conteúdo do carrinho (remoção/atualização)
    notifyCartChanged() {
      this.changedSubject.next();
    }
}
