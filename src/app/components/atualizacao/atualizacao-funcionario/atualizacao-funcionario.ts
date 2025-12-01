import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { PostService } from '../../../servicos/api/post-service';
import { GetServicos } from '../../../servicos/api/get-servicos';
import { Estado } from '../../../models/estado';
import { jwtDecode } from 'jwt-decode';
import { DecodeToken } from '../../../models/decode-token';
import { Router } from '@angular/router';

@Component({
  selector: 'app-atualizacao-funcionario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './atualizacao-funcionario.html',
  styleUrls: ['./atualizacao-funcionario.css']
})
export class AtualizacaoFuncionario implements OnInit {
  estados: Estado[] = [];
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
      idEstado: '',
    }
  };

  loading: boolean = false;
  loadError: string = '';
  origemCarga: string = '';

  private postService = inject(PostService);
  private getServicos = inject(GetServicos);
  private router = inject(Router);

  ngOnInit(): void {
    this.carregarEstados();

    this.loading = true;
    this.loadError = '';
    const token = sessionStorage.getItem('authToken') || '';
    const idUsuarioRaw = sessionStorage.getItem('userId');
    const idUsuario = idUsuarioRaw ? Number(idUsuarioRaw) : NaN;

    if (!token) {
      this.loadError = 'Sessão expirada. Faça login novamente.';
      this.loading = false;
      console.warn('[AtualizacaoFuncionario] Sem token para carregar dados.');
      return;
    }

    if (!isNaN(idUsuario) && idUsuario > 0) {
      this.carregarPorId(idUsuario, token);
      return;
    }

    console.log('[AtualizacaoFuncionario] userId não encontrado, tentando via email do token...');
    try {
      const decoded = jwtDecode<DecodeToken>(token);
      const email = decoded.sub;

      if (!email) {
        this.loadError = 'Token inválido. Faça login novamente.';
        this.loading = false;
        console.error('[AtualizacaoFuncionario] Token não contém email (sub).');
        return;
      }

      this.postService.listarUsuarios(token).subscribe({
        next: usuarios => {
          const usuarioEncontrado = usuarios?.find(u => {
            const userEmail = u.email?.endereco || u.email || u.Email || '';
            return String(userEmail).toLowerCase() === email.toLowerCase();
          });
          if (usuarioEncontrado) {
            const userId = usuarioEncontrado.idPessoa || usuarioEncontrado.id;
            if (userId) {
              sessionStorage.setItem('userId', String(userId));
              this.aplicarDados(usuarioEncontrado, 'listarUsuarios-filtrado');
            } else {
              this.loadError = 'Funcionário encontrado mas sem ID. Contate o suporte.';
              this.loading = false;
            }
          } else {
            this.loadError = 'Não foi possível encontrar seus dados. Contate o suporte.';
            this.loading = false;
          }
        },
        error: err => {
          console.error('[AtualizacaoFuncionario] Falha ao listar usuários:', err);
          const possibleId = (decoded as any).id || (decoded as any).userId || (decoded as any).user_id;
          if (possibleId) {
            sessionStorage.setItem('userId', String(possibleId));
            this.carregarPorId(Number(possibleId), token);
          } else {
            this.loadError = 'Não foi possível identificar seu usuário. Faça login novamente.';
            this.loading = false;
          }
        }
      });
    } catch (decodeErr) {
      this.loadError = 'Token inválido. Faça login novamente.';
      this.loading = false;
      console.error('[AtualizacaoFuncionario] Erro ao decodificar token:', decodeErr);
    }
  }

  private carregarEstados(): void {
    this.getServicos.getEstados().subscribe({
      next: lista => this.estados = lista || [],
      error: err => console.error('[AtualizacaoFuncionario] Erro ao carregar estados:', err)
    });
  }

  private carregarPorId(idUsuario: number, token: string): void {
    this.origemCarga = 'id';
    this.postService.getUsuarioPorIdSingular(idUsuario, token).subscribe({
      next: data => this.aplicarDados(data, 'getUsuarioPorIdSingular'),
      error: errSingular => {
        console.warn('[AtualizacaoFuncionario] Falha rota singular, tentando plural...', errSingular);
        this.postService.getUsuarioPorId(idUsuario, token).subscribe({
          next: data => this.aplicarDados(data, 'getUsuarioPorIdPlural'),
          error: errPlural => {
            this.loadError = 'Erro ao carregar dados do funcionário.';
            this.loading = false;
            console.error('[AtualizacaoFuncionario] Falha em ambas rotas:', errPlural);
          }
        });
      }
    });
  }

  private aplicarDados(data: any, fonte: string) {
    const adaptar = (orig: any) => {
      const enderecoOrig = orig?.endereco || {};
      const enderecoPadrao = {
        nomeLogradouro: enderecoOrig.nomeLogradouro || enderecoOrig.logradouro || enderecoOrig.rua || '',
        numero: enderecoOrig.numero || '',
        complemento: enderecoOrig.complemento || '',
        bairro: enderecoOrig.bairro || '',
        cep: enderecoOrig.cep?.valor || enderecoOrig.cep || enderecoOrig.cepNumero || '',
        cidade: enderecoOrig.cidade || '',
        idEstado: enderecoOrig.idEstado || enderecoOrig.estadoId || '',
        idEndereco: enderecoOrig.idEndereco || enderecoOrig.id || null
      };
      const rawDt = orig.dtNascimento || orig.dataNascimento || '';
      let dtNascimento = '';
      if (typeof rawDt === 'string' && rawDt) {
        if (/^\d{4}-\d{2}-\d{2}/.test(rawDt)) dtNascimento = rawDt.substring(0, 10);
        else if (/^\d{2}\/\d{2}\/\d{4}$/.test(rawDt)) {
          const [d, m, y] = rawDt.split('/');
          dtNascimento = `${y}-${m}-${d}`;
        }
      }
      const rawSexo = orig.sexo || orig.genero || '';
      let sexo = '';
      if (typeof rawSexo === 'string') {
        const up = rawSexo.toUpperCase();
        const mapLetterToWord: any = { 'M': 'MASCULINO', 'F': 'FEMININO', 'O': 'OUTRO' };
        if (['M', 'F', 'O'].includes(up)) {
          sexo = mapLetterToWord[up];
        } else if (['MASCULINO', 'FEMININO', 'OUTRO'].includes(up)) {
          sexo = up;
        } else {
          sexo = '';
        }
      }
      const cpfRaw = orig.cpf?.valor || orig.cpf || orig.cpfNumero || '';
      const emailRaw = orig.email?.endereco || orig.email || '';
      const telefoneRaw = orig.telefone?.numero || orig.telefone || orig.celular || '';
      return {
        ...this.user,
        nome: orig.nome || orig.name || this.user.nome,
        cpf: cpfRaw || this.user.cpf,
  sexo: sexo ?? this.user.sexo,
        funcao: orig.funcao || orig.role || this.user.funcao,
        dtNascimento: dtNascimento || this.user.dtNascimento,
        telefone: telefoneRaw || this.user.telefone,
        email: emailRaw || this.user.email,
        endereco: enderecoPadrao
      };
    };
    this.user = adaptar(data || {});
    if (this.user.cpf) {
      const digits = String(this.user.cpf).replace(/\D/g, '');
      if (digits.length === 11) this.user.cpf = digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    this.loading = false;
    console.log(`[AtualizacaoFuncionario] Dados aplicados via ${fonte}.`, this.user);
  }

  mascaraCPF(event: any): void {
    const input = event.target as HTMLInputElement;
    const cursorPos = input.selectionStart ?? 0;
    const valorAnterior = input.value;
    
    let valor = input.value.replace(/\D/g, '').slice(0, 11);
    const digitosAntesCursor = valorAnterior.slice(0, cursorPos).replace(/\D/g, '').length;
    
    if (valor.length > 9) {
      valor = valor.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    } else if (valor.length > 6) {
      valor = valor.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    } else if (valor.length > 3) {
      valor = valor.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    }
    
    let novaPosicao = 0;
    let digitosContados = 0;
    
    for (let i = 0; i < valor.length && digitosContados < digitosAntesCursor; i++) {
      if (/\d/.test(valor[i])) {
        digitosContados++;
      }
      novaPosicao = i + 1;
    }
    
    input.value = valor;
    input.setSelectionRange(novaPosicao, novaPosicao);
  }

  mascaraTelefone(event: any): void {
    const input = event.target as HTMLInputElement;
    let valor = input.value.replace(/\D/g, '').slice(0, 11);
    input.value = valor;
  }

  onSubmit(form: NgForm) {
    const payload = JSON.parse(JSON.stringify(this.user));
    const enderecoPadrao = {
      nomeLogradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cep: '',
      cidade: '',
      idEstado: null,
    };
    if (!payload.endereco || typeof payload.endereco !== 'object') payload.endereco = { ...enderecoPadrao };
    else payload.endereco = Object.assign({}, enderecoPadrao, payload.endereco);
    const obrigEndereco = ['nomeLogradouro', 'numero', 'bairro', 'cep', 'cidade', 'idEstado'];
    for (const campo of obrigEndereco) {
      if (campo === 'idEstado') {
        if (payload.endereco[campo] === undefined || payload.endereco[campo] === '') payload.endereco[campo] = null;
      } else if (!payload.endereco[campo] || String(payload.endereco[campo]).trim() === '') {
        alert('Preencha o campo obrigatório do endereço: ' + campo);
        return;
      }
    }
    if (form && form.valid) {
      const simples = ['nome', 'sexo', 'funcao', 'dtNascimento'];
      for (const campo of simples) if (typeof payload[campo] !== 'string') payload[campo] = payload[campo] ? String(payload[campo]) : '';
      if (payload.cpf) payload.cpf = String(payload.cpf).replace(/\D/g, '');
      if (payload.telefone) payload.telefone = String(payload.telefone).replace(/\D/g, '');
      if (payload?.endereco?.cep) payload.endereco.cep = String(payload.endereco.cep).replace(/\D/g, '');
      if (payload.senha !== undefined && payload.senha !== null) payload.senha = String(payload.senha);
      if (payload?.endereco) {
        const rawIdEstado = payload.endereco.idEstado;
        if (rawIdEstado === '' || rawIdEstado === undefined) payload.endereco.idEstado = null;
        else if (typeof rawIdEstado === 'string' && /^\d+$/.test(rawIdEstado)) payload.endereco.idEstado = Number(rawIdEstado);
        else if (typeof rawIdEstado !== 'number') payload.endereco.idEstado = null;
        if (payload.endereco.idEndereco == null) payload.endereco.idEndereco = 0;
        if (!payload.endereco.complemento || payload.endereco.complemento.trim() === '') payload.endereco.complemento = null;
      }
      const mapSexoParaBackend: any = { 'M': 'MASCULINO', 'F': 'FEMININO', 'O': 'OUTRO' };
      if (payload.sexo) payload.sexo = mapSexoParaBackend[payload.sexo] || payload.sexo;
      if (!payload.senha || String(payload.senha).trim() === '') {
        delete payload.senha;
        console.log('[AtualizacaoFuncionario] Senha não informada: não será alterada.');
      }
      const idUsuario = Number(sessionStorage.getItem('userId'));
      const token = sessionStorage.getItem('authToken') || '';
      if (!token) { alert('Sessão expirada. Faça login novamente.'); return; }
      if (!idUsuario || isNaN(idUsuario)) { alert('ID do funcionário não encontrado. Recarregue a página.'); return; }
      this.postService.putUsuario(idUsuario, payload, token).subscribe({
        next: res => { console.log('Funcionário atualizado com sucesso:', res); alert('Dados do funcionário atualizados!'); },
        error: err => {
          console.error('Erro ao atualizar funcionário:', err);
          if (err.status === 403) alert('Sem permissão para atualizar este cadastro.');
          else if (err.status === 401) alert('Sessão expirada. Faça login novamente.');
          else if (err.status === 404) alert('Funcionário não encontrado.');
          else if (err.status === 500) {
            const mensagemErro = err.error?.mensagem || err.error?.message || 'Erro interno do servidor';
            alert(`Erro no servidor: ${mensagemErro}`);
          } else alert('Erro ao atualizar cadastro. Tente novamente.');
        }
      });
    } else {
      alert('Por favor, preencha todos os campos obrigatórios.');
    }
  }

  cancelar() { 
    this.ngOnInit();
    this.router.navigate(['/menu-principal']);

  }
}
