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
        console.log(email)
        console.log(senha)
        console.log(cargo)
        console.log('Sucesso no Registro', res);
        this.closeModal();
      },
      error: (err) => {
        console.log(email)
        console.log(senha)
        console.log(cargo)
        console.error('Erro no registro', err);
        this.closeModal();
      }
    })
  }
}
