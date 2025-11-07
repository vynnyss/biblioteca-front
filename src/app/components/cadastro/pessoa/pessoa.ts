import { Component, inject } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
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
    firstName: '',
    lastName: '',
    cpf: '',
    dtNascimento: '',
    sexo: '',
    email: '',
    telefone: '',
    endereco: {
       nomeLogradouro: '',
       numero: '',
       complemento: '',
       bairro:'',
       cep: '',
       cidade: '',
       idEstado: 0
      }
  };

  private servicoApi = inject(PostService);

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

  cancelar() {
    console.log('Ação de cancelar executada');
  }


  onSubmit(form: NgForm) {
    if (form) {
      this.user = form.value;
      
      const dadosDoFormulario = form.value;
      console.log('Dados do formulário:', dadosDoFormulario);
      
    } else {
      console.log('Formulário inválido');
    }
  }
}
