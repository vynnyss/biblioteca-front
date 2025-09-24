import { Dialog } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { Login } from '../modal/login/login';
import { Registro } from '../modal/registro/registro';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  private dialog = inject(Dialog)
  openModalLogin(){
    this.dialog.open(Login)
  }
  openModalRegistro(){
    this.dialog.open(Registro)
  }
}
