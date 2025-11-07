import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-autor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './autor.html',
  styleUrls: ['./autor.css']
})
export class Autor {
  formAutor: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formAutor = this.fb.group({
      nome: ['', Validators.required],
      nacionalidade: [''],
      dataNascimento: [''],
      formacao: [''] // ✅ ponto e vírgula aqui se for a última linha
    });
  }

  salvarAutor() {
    if (this.formAutor.valid) {
      console.log('Autor salvo:', this.formAutor.value);
    }
  }

  limparFormulario() {
    this.formAutor.reset();
  }
}
