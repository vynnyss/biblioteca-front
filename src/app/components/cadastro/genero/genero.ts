import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-genero',
  templateUrl: './genero.html',
  styleUrls: ['./genero.css']
})
export class Genero implements OnInit {
  generoForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.generoForm = this.fb.group({
      nome: ['', Validators.required]
    });
  }
}