import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { PostService } from '../../../servicos/api/post-service';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css'
})

export class Login {
  private dialogRef = inject(DialogRef, { optional: true });
  private servicoApi = inject(PostService);

  closeModal(){
    this.dialogRef?.close();
  }

  enviarLogin(email: string, senha: string){
    this.servicoApi.postLogin(email, senha).subscribe({
      next: (res) => {
        console.log(email)
        console.log(senha)
        console.log('Sucesso no Login', res);
        this.closeModal();
      },
        error: (err) => {
        console.log(email)
        console.log(senha)
        console.error('Erro no login', err);
        this.closeModal();
      }
    });
  }
}
