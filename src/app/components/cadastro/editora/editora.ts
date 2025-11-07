import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-editora',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editora.html',
  styleUrls: ['./editora.css']
})
export class Editora {
  formEditora: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formEditora = this.fb.group({
      nome: ['', Validators.required],
      cnpj: ['', [Validators.pattern(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/)]],
      email: ['', [Validators.required, Validators.email]],
      telefone: [''],
      site: ['', [Validators.pattern(/^(https?:\/\/)?([\w\-]+\.)+[a-z]{2,6}(\/.*)?$/i)]],
      ativo: [true],
      logradouro: [''],
      numero: [''],
      bairro: [''],
      cidade: [''],
      uf: ['', [Validators.maxLength(2)]],
      cep: [''],
      descricao: ['']
    });
  }

  
  get f() {
    return this.formEditora.controls;
  }

  salvarEditora() {
    if (this.formEditora.invalid) {
      this.formEditora.markAllAsTouched();
      return;
    }

    console.log('📘 Editora salva:', this.formEditora.value);
    alert('Editora cadastrada com sucesso!');
    this.formEditora.reset({ ativo: true });
  }

  limparFormulario() {
    this.formEditora.reset({ ativo: true });
  }
}