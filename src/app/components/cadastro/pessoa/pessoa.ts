import { Component, inject } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PostService } from '../../../servicos/api/post-service';

@Component({
  selector: 'app-pessoa',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pessoa.html',
  styleUrls: ['./pessoa.css']
})
export class Pessoa {
  user: any = {
    nome: '',
    cpf: '',
    dtNascimento: '',
    sexo: '',
    email: '',
    telefone: '',
    senha: '',
    endereco: {
      nomeLogradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cep: '',
      cidade: '',
      idEstado: 0
    }
  };

  private servicoApi = inject(PostService);
  private router = inject(Router);

  mascaraCPF(event: any): void {
    const input = event.target as HTMLInputElement;
    let valor = input.value.replace(/\D/g, '').slice(0, 11);
    const pos = input.selectionStart ?? valor.length;

    if (valor.length > 9)
      valor = valor.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    else if (valor.length > 6)
      valor = valor.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    else if (valor.length > 3)
      valor = valor.replace(/(\d{3})(\d{1,3})/, '$1.$2');

    input.value = valor;
    input.setSelectionRange(pos, pos);
  }

  cancelar(): void {
    console.log('Ação de cancelar executada');
  }

  onSubmit(form: NgForm): void {
    if (!form.valid) {
      console.warn('Formulário inválido');
      alert('⚠️ Preencha todos os campos obrigatórios.');
      return;
    }

    const cpfLimpo = (this.user.cpf || '').replace(/\D/g, '');
    const cepLimpo = (this.user.endereco?.cep || '').replace(/\D/g, '');
    const telefoneLimpo = (this.user.telefone || '').replace(/\D/g, '');

    const payload = {
      nome: this.user.nome,
      cpf: cpfLimpo,
      sexo: this.user.sexo,
      dtNascimento: this.user.dtNascimento,
      telefone: telefoneLimpo,
      email: this.user.email,
      senha: this.user.senha,
      endereco: {
        nomeLogradouro: this.user.endereco.nomeLogradouro,
        numero: this.user.endereco.numero,
        complemento: this.user.endereco.complemento,
        bairro: this.user.endereco.bairro,
        cep: cepLimpo,
        cidade: this.user.endereco.cidade,
        idEstado: Number(this.user.endereco.idEstado)
      }
    };

    console.log('📤 Enviando para o backend:', payload);

    this.servicoApi.postCadastro('http://localhost:8080/auth/registro', payload).subscribe({
      next: (res) => {
        console.log('✅ Usuário cadastrado com sucesso:', res);
        alert('✅ Cadastro realizado com sucesso!');
        form.resetForm();

        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 1000);
      },
      error: (err) => {
        console.error('❌ Erro ao cadastrar usuário:', err);
        let msg = 'Erro ao cadastrar. Verifique os dados e tente novamente.';

        if (err.status === 200 && err.error?.text) {
          alert(`✅ ${err.error.text}`);
          form.resetForm();
          setTimeout(() => this.router.navigate(['/home']), 1000);
          return;
        }

        if (err?.error) {
          const backend = err.error;
          msg =
            typeof backend === 'string'
              ? backend
              : backend?.mensagem || backend?.message || JSON.stringify(backend);
        }

        alert(`⚠️ ${msg}`);
      }
    });
  }
}
