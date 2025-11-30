import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
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
  private router = inject(Router);

  closeModal(res?:LoginResponse){
    this.dialogRef?.close(res);
  }

  enviarLogin(email: string, senha: string){
    this.servicoApi.postLogin(email, senha).subscribe({
      next: (res: LoginResponse) => {
        this.closeModal(res);
        this.router.navigate(['/']);
      },
        error: (err) => {
        console.error('Erro no login', err);
        const backend = err.error;
        let msg =
          typeof backend === 'string'
            ? backend
            : backend?.mensagem || backend?.message || JSON.stringify(backend);
        alert(msg);
      }
    });
  }
}
