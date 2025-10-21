import { Dialog } from '@angular/cdk/dialog';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Login } from '../modal/login/login';
import { Registro } from '../modal/registro/registro';
import { LoginResponse } from '../../models/login-response';


@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  
  private dialog = inject(Dialog)

  @Input() isLogged: boolean = false

  @Output() respostaLogin = new EventEmitter<LoginResponse>();
  @Output() emitirLogout = new EventEmitter();

  openModalLogin(){

     const dialogRef = this.dialog.open<LoginResponse>(Login)

     dialogRef.closed.subscribe(result =>{
      if (result) {
        this.respostaLogin.emit(result)
     }
  })
  }
  openModalRegistro(){
    this.dialog.open(Registro)
  }

  realizarLogout(){
    this.emitirLogout.emit()
  }
}
