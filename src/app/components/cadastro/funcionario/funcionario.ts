import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { PostService } from '../../../servicos/api/post-service';
import { GetServicos } from '../../../servicos/api/get-servicos';
import { Estado } from '../../../models/estado';

@Component({
  selector: 'app-funcionario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './funcionario.html',
  styleUrls: ['./funcionario.css']
})
export class Funcionario implements OnInit {
  estados: Estado[] = [];

  user = {
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
      idEstado: 0
    }
  };

  private api = inject(PostService);
  private getServicos = inject(GetServicos);
  private router = inject(Router);

  ngOnInit(): void {
    this.carregarEstados();
  }

  carregarEstados(): void {
    this.getServicos.getEstados().subscribe({
      next: (data) => {
        this.estados = data;
        console.log('✅ Estados carregados:', this.estados);
      },
      error: (err) => {
        console.error('❌ Erro ao carregar estados:', err);
        alert('⚠️ Erro ao carregar lista de estados.');
      }
    });
  }

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
    const confirmar = confirm('Deseja realmente cancelar o cadastro? Todos os dados serão perdidos.');
    if (confirmar) {
      this.router.navigate(['/home']);
    }
  }

  onSubmit(form: NgForm): void {
    if (!form.valid) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    if (!this.user.email || !this.user.email.includes('@')) {
      alert('Email inválido. Deve conter @');
      return;
    }

    if (!this.user.cpf || this.user.cpf.replace(/\D/g, '').length !== 11) {
      alert('CPF deve ter 11 dígitos.');
      return;
    }

    const payload = {
      nome: this.user.nome.trim(),
      cpf: this.user.cpf.replace(/\D/g, ''),
      sexo: this.user.sexo,
      funcao: this.user.funcao,
      dtNascimento: this.user.dtNascimento,
      telefone: this.user.telefone.replace(/\D/g, ''),
      email: this.user.email.trim().toLowerCase(),
      senha: this.user.senha,
      endereco: {
        nomeLogradouro: this.user.endereco.nomeLogradouro.trim(),
        numero: this.user.endereco.numero.trim(),
        complemento: this.user.endereco.complemento?.trim() || null,
        bairro: this.user.endereco.bairro.trim(),
        cep: this.user.endereco.cep.replace(/\D/g, ''),
        cidade: this.user.endereco.cidade.trim(),
        idEstado: Number(this.user.endereco.idEstado)
      }
    };

    console.log('📤 Enviando JSON:', JSON.stringify(payload, null, 2));
    console.log('🔍 Email específico:', payload.email);
    console.log('🔍 Tipo do email:', typeof payload.email);
    console.log('🔍 Length do email:', payload.email.length);

    this.api.postFuncionario(payload).subscribe({
      next: (res) => {
        console.log('✅ Servidor respondeu:', res);
        alert('Funcionário cadastrado com sucesso!');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('❌ Erro completo:', err);
        
        let mensagem = 'Erro ao cadastrar funcionário.';
        
        if (err.error) {
          if (typeof err.error === 'string') {
            try {
              const erros = JSON.parse(err.error);
              mensagem = Array.isArray(erros) ? erros.join('\n') : erros;
            } catch {
              mensagem = err.error;
            }
          } 
          else if (Array.isArray(err.error)) {
            mensagem = err.error.join('\n');
          }
          else if (err.error.mensagem) {
            mensagem = err.error.mensagem;
          }
        }
        
        alert(mensagem);
      }
    });
  }
}
