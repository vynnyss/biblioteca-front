import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { PostService } from '../../../servicos/api/post-service';
import { LoginResponse } from '../../../models/login-response';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css'
})

export class Login {
  private dialogRef = inject<DialogRef<LoginResponse>>(DialogRef);
  private servicoApi = inject(PostService);

  closeModal(res?:LoginResponse){
    this.dialogRef?.close(res);
  }

  enviarLogin(email: string, senha: string){
    this.servicoApi.postLogin(email, senha).subscribe({
      next: (res: LoginResponse) => {
        this.closeModal(res);
      },
        error: (err) => {
        console.error('Erro no login', err);
        this.closeModal();
      }
    });
  }
}
