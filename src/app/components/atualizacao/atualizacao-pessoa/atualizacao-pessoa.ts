import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { PostService } from '../../../servicos/api/post-service';

@Component({
  selector: 'app-atualizacao-pessoa',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './atualizacao-pessoa.html',
  styleUrls: ['./atualizacao-pessoa.css']
})
export class AtualizacaoPessoa {
  user: any = {
    nome: '',
    cpf: '',
    sexo: '',
    funcao: '',
    dtNascimento: '',
    telefone: '',
    email: '',
    senha: '',
    endereco: {
      nomeLogradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cep: '',
      cidade: '',
      idEstado: ''
    }
  };

  private postService = inject(PostService);

  mascaraCPF(event: any): void {
    const input = event.target;
    let valor = input.value;

    const posInicial = input.selectionStart;

    valor = valor.replace(/\D/g, '');

    if (valor.length > 11) {
      valor = valor.slice(0, 11);
    }
    if (valor.length > 9) {
      valor = valor.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    } else if (valor.length > 6) {
      valor = valor.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    } else if (valor.length > 3) {
      valor = valor.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    }

    input.value = valor;
    input.setSelectionRange(posInicial, posInicial);
  }

onSubmit(form: NgForm) {
  if (form && form.valid) {
    const payload = this.user;
    const idUsuario = 4;

    this.postService.putUsuario(idUsuario, payload).subscribe({
      next: (res) => console.log('Usuário atualizado com sucesso:', res),
      error: (err) => console.error('Erro ao atualizar usuário:', err)
    });
  } else {
    console.log('Formulário inválido');
  }
}
    cancelar() {
      this.user = {
        nome: '',
        cpf: '',
        sexo: '',
        funcao: '',
        dtNascimento: '',
        telefone: '',
        email: '',
        senha: '',
        endereco: {
          nomeLogradouro: '',
          numero: '',
          complemento: '',
          bairro: '',
          cep: '',
          cidade: '',
          idEstado: ''
        }
      };
    }
  }
