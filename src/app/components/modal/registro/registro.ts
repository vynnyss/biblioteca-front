import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { PostService } from '../../../servicos/api/post-service';

@Component({
  selector: 'app-registro',
  imports: [],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro {

  private dialogRef = inject(DialogRef, { optional: true });
  private servicoApi = inject(PostService);
  
  closeModal(){
    this.dialogRef?.close();
  }
  
  enviarRegistro(email: string, senha: string, cargo: string){
    this.servicoApi.postRegistro(email, senha, cargo).subscribe({
      next: (res) => {
        console.log('Registro realizado com sucesso', res);
      },
      error: (err) => {
        console.error('Erro no registro', err);
      }
    })
  }
}
