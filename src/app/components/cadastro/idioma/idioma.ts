import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-idioma',
  templateUrl: './idioma.html',
  styleUrls: ['./idioma.css']
})
export class Idioma {
  cancelar() {
    alert('Ação de cancelar!');
  }

  salvar() {
    alert('Idioma salvo com sucesso!');
  }
}