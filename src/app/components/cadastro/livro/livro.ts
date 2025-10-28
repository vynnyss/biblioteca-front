import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-livro',
  imports: [FormsModule],
  templateUrl: './livro.html',
  styleUrl: './livro.css'
})
export class Livro {

  model = { name: '' };

  onSubmit(form: NgForm) {
    console.log('Form submitted!', form.value);
  }
}
