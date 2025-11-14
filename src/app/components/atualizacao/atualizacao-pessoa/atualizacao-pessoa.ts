import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { PostService } from '../../../servicos/api/post-service';
import { GetServicos } from '../../../servicos/api/get-servicos';
import { Estado } from '../../../models/estado';
import { jwtDecode } from 'jwt-decode';
import { DecodeToken } from '../../../models/decode-token';

@Component({
  selector: 'app-atualizacao-pessoa',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './atualizacao-pessoa.html',
  styleUrls: ['./atualizacao-pessoa.css']
})
export class AtualizacaoPessoa implements OnInit {
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
      idEndereco: null
    }
  };

  loading: boolean = false;
  loadError: string = '';
  origemCarga: string = '';
  isEditandoOutroCliente: boolean = false;
  private userRole: string = '';

  private postService = inject(PostService);
  private getServicos = inject(GetServicos);
  private router = inject(Router);

  public isCliente(): boolean {
    return this.userRole === 'CLIENTE';
  }

  ngOnInit(): void {
    // Carrega lista de estados para o dropdown
    this.carregarEstados();

    // Carrega a role do usuário
    this.carregarUserRole();

    // Verifica se há um ID de cliente passado pela navegação
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state || history.state;
    const idCliente = state?.idCliente;

    if (idCliente) {
      // Modo edição de outro cliente
      this.isEditandoOutroCliente = true;
      const token = sessionStorage.getItem('authToken') || '';
      if (!token) {
        this.loadError = 'Sessão expirada. Faça login novamente.';
        this.loading = false;
        return;
      }
      this.carregarPorId(idCliente, token);
      return;
    }

    // Modo edição do próprio usuário logado
    this.isEditandoOutroCliente = false;
    this.loading = true;
    this.loadError = '';
    const token = sessionStorage.getItem('authToken') || '';
    const idUsuarioRaw = sessionStorage.getItem('userId');
    const idUsuario = idUsuarioRaw ? Number(idUsuarioRaw) : NaN;

    if (!token) {
      this.loadError = 'Sessão expirada. Faça login novamente.';
      this.loading = false;
      console.warn('[AtualizacaoPessoa] Sem token para carregar dados.');
      return;
    }

    
    if (!isNaN(idUsuario) && idUsuario > 0) {
      this.carregarPorId(idUsuario, token);
      return;
    }

    console.log('[AtualizacaoPessoa] userId não encontrado, tentando via email do token...');
    try {
      const decoded = jwtDecode<DecodeToken>(token);
      const email = decoded.sub; 
      
      if (!email) {
        this.loadError = 'Token inválido. Faça login novamente.';
        this.loading = false;
        console.error('[AtualizacaoPessoa] Token não contém email (sub).');
        return;
      }

      console.log(`[AtualizacaoPessoa] Buscando usuário pelo email: ${email} via lista de usuários...`);
      this.postService.listarUsuarios(token).subscribe({
        next: usuarios => {
          console.log(`[AtualizacaoPessoa] Recebidos ${usuarios?.length || 0} usuários, procurando por ${email}...`);
          console.log('[AtualizacaoPessoa] Exemplo de usuário:', JSON.stringify(usuarios?.[0], null, 2));
          
          const usuarioEncontrado = usuarios?.find(u => {
            const userEmail = u.email?.endereco || u.email || u.Email || '';
            return String(userEmail).toLowerCase() === email.toLowerCase();
          });
          
          if (usuarioEncontrado) {
            const userId = usuarioEncontrado.idPessoa || usuarioEncontrado.id;
            if (userId) {
              sessionStorage.setItem('userId', String(userId));
              console.log(`[AtualizacaoPessoa] userId ${userId} encontrado e salvo no sessionStorage.`);
              this.aplicarDados(usuarioEncontrado, 'listarUsuarios-filtrado');
            } else {
              this.loadError = 'Usuário encontrado mas sem ID. Entre em contato com o suporte.';
              this.loading = false;
              console.error('[AtualizacaoPessoa] Usuário sem ID:', usuarioEncontrado);
            }
          } else {
            this.loadError = 'Não foi possível encontrar seus dados. Entre em contato com o suporte.';
            this.loading = false;
            console.error('[AtualizacaoPessoa] Usuário não encontrado na lista com email:', email);
            console.error('[AtualizacaoPessoa] Lista de emails recebidos:', usuarios?.map(u => u.email?.endereco || u.email || 'sem email'));
          }
        },
        error: err => {
          console.error('[AtualizacaoPessoa] Falha ao listar usuários:', err);
          const possibleId = (decoded as any).id || (decoded as any).userId || (decoded as any).user_id;
          if (possibleId) {
            console.log(`[AtualizacaoPessoa] ID encontrado no token: ${possibleId}`);
            sessionStorage.setItem('userId', String(possibleId));
            this.carregarPorId(Number(possibleId), token);
          } else {
            this.loadError = 'Não foi possível identificar seu usuário. Faça login novamente.';
            this.loading = false;
            console.error('[AtualizacaoPessoa] Nenhum ID disponível no token:', decoded);
          }
        }
      });
    } catch (decodeErr) {
      this.loadError = 'Token inválido. Faça login novamente.';
      this.loading = false;
      console.error('[AtualizacaoPessoa] Erro ao decodificar token:', decodeErr);
    }
  }

  private carregarEstados(): void {
    this.getServicos.getEstados().subscribe({
      next: (lista) => {
        this.estados = lista || [];
        // Se vier idEstado como string, mantém; conversão ocorre no submit
        // Apenas log para debug
        console.log('[AtualizacaoPessoa] Estados carregados:', this.estados);
      },
      error: (err) => {
        console.error('[AtualizacaoPessoa] Erro ao carregar estados:', err);
      }
    });
  }

  private carregarUserRole(): void {
    try {
      // Primeiro tenta pelo decodedToken
      const raw = sessionStorage.getItem('decodedToken');
      console.log('[AtualizacaoPessoa] Raw decodedToken:', raw);
      
      if (raw) {
        const decoded = JSON.parse(raw) as { role?: string };
        this.userRole = decoded?.role ?? '';
        console.log('[AtualizacaoPessoa] Role carregada via decodedToken:', this.userRole);
        return;
      }
      
      // Se não encontrou, tenta decodificar o authToken
      const authToken = sessionStorage.getItem('authToken');
      console.log('[AtualizacaoPessoa] Tentando authToken:', authToken ? 'existe' : 'não existe');
      
      if (authToken) {
        const decoded = jwtDecode<DecodeToken>(authToken);
        this.userRole = (decoded as any)?.role ?? '';
        console.log('[AtualizacaoPessoa] Role carregada via authToken:', this.userRole);
        return;
      }
      
      console.log('[AtualizacaoPessoa] Nenhum token encontrado para carregar role');
      this.userRole = '';
      
    } catch (e) {
      console.error('[AtualizacaoPessoa] Erro ao carregar role do usuário:', e);
      this.userRole = '';
    }
  }

  private carregarPorId(idUsuario: number, token: string): void {
    this.origemCarga = 'id';
    console.log(`[AtualizacaoPessoa] Carregando usuário por ID (${idUsuario}) tentativa singular...`);
    
    this.postService.getUsuarioPorIdSingular(idUsuario, token).subscribe({
      next: data => this.aplicarDados(data, 'getUsuarioPorIdSingular'),
      error: errSingular => {
        console.warn('[AtualizacaoPessoa] Falha rota singular, tentando plural...', errSingular);
        this.postService.getUsuarioPorId(idUsuario, token).subscribe({
          next: data => this.aplicarDados(data, 'getUsuarioPorIdPlural'),
          error: errPlural => {
            this.loadError = 'Erro ao carregar dados do usuário. Verifique sua conexão.';
            this.loading = false;
            console.error('[AtualizacaoPessoa] Falha em ambas rotas (singular e plural):', errPlural);
          }
        });
      }
    });
  }

  private aplicarDados(data: any, fonte: string) {
    const adaptar = (orig: any) => {
      const enderecoOrig = orig?.endereco || {};
      console.log('[AtualizacaoPessoa] Raw endereco recebido do backend:', enderecoOrig);
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
        if (/^\d{4}-\d{2}-\d{2}/.test(rawDt)) {
          dtNascimento = rawDt.substring(0, 10);
        } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(rawDt)) {
          const [d, m, y] = rawDt.split('/');
          dtNascimento = `${y}-${m}-${d}`;
        }
      }

      const rawSexo = orig.sexo || orig.genero || '';
      let sexo = rawSexo;
      // Mantém os valores completos para o select (MASCULINO, FEMININO, OUTRO)
      if (typeof rawSexo === 'string' && rawSexo.length === 1) {
        // Se vier como letra única (M, F, O), converte para nome completo
        const mapSexo: any = { F: 'FEMININO', M: 'MASCULINO', O: 'OUTRO' };
        sexo = mapSexo[rawSexo.toUpperCase()] || rawSexo;
      } else if (typeof rawSexo === 'string' && rawSexo.length > 1) {
        // Se já vier como nome completo, mantém em uppercase
        sexo = rawSexo.toUpperCase();
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
      if (digits.length === 11) {
        this.user.cpf = digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      }
    }

    // Salva o ID do usuário sendo editado
    const idPessoa = data?.idPessoa || data?.id;
    if (idPessoa) {
      sessionStorage.setItem('userId', String(idPessoa));
    }

    this.loading = false;
    console.log(`[AtualizacaoPessoa] Dados aplicados via ${fonte}. OrigemCarga=${this.origemCarga}`, this.user);
  }

  mascaraCPF(event: any): void {
    const input = event.target;
    let valor = input.value;
    const posInicial = input.selectionStart;
    valor = valor.replace(/\D/g, '');
    if (valor.length > 11) valor = valor.slice(0, 11);
    if (valor.length > 9)
      valor = valor.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    else if (valor.length > 6)
      valor = valor.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    else if (valor.length > 3)
      valor = valor.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    input.value = valor;
    input.setSelectionRange(posInicial, posInicial);
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
      idEndereco: null
    };
    if (!payload.endereco || typeof payload.endereco !== 'object') {
      payload.endereco = { ...enderecoPadrao };
    } else {
      payload.endereco = Object.assign({}, enderecoPadrao, payload.endereco);
    }
    const camposObrigatoriosEndereco = [
      'nomeLogradouro', 'numero', 'bairro', 'cep', 'cidade', 'idEstado'
    ];
    if (!payload.endereco) {
      alert('Preencha todos os campos do endereço.');
      return;
    }
    for (const campo of camposObrigatoriosEndereco) {
      if (campo === 'idEstado') {
        if (payload.endereco[campo] === undefined || payload.endereco[campo] === '') {
          payload.endereco[campo] = null;
        }
      } else {
        if (!payload.endereco[campo] || String(payload.endereco[campo]).trim() === '') {
          alert('Preencha o campo obrigatório do endereço: ' + campo);
          return;
        }
      }
    }
    if (form && form.valid) {
      const simples = ['nome', 'sexo', 'funcao', 'dtNascimento'];
      for (const campo of simples) {
        if (typeof payload[campo] !== 'string') {
          payload[campo] = payload[campo] ? String(payload[campo]) : '';
        }
      }

      if (payload.cpf) {
        payload.cpf = String(payload.cpf).replace(/\D/g, '');
      }
      if (payload.telefone) {
        payload.telefone = String(payload.telefone).replace(/\D/g, '');
      }
      if (payload.email) {
        payload.email = String(payload.email);
      }
      if (payload?.endereco?.cep) payload.endereco.cep = String(payload.endereco.cep).replace(/\D/g, '');
      if (payload.senha !== undefined && payload.senha !== null) {
        payload.senha = String(payload.senha);
      }
      if (payload?.endereco) {
        const rawIdEstado = payload.endereco.idEstado;
        if (rawIdEstado === '' || rawIdEstado === undefined) {
          payload.endereco.idEstado = null;
        } else if (typeof rawIdEstado === 'string' && /^\d+$/.test(rawIdEstado)) {
          payload.endereco.idEstado = Number(rawIdEstado);
        } else if (typeof rawIdEstado === 'number') {
          // ok
        } else {
          payload.endereco.idEstado = null;
        }
        if (payload.endereco.idEndereco == null) {
          payload.endereco.idEndereco = 0;
        }
      }

      // Sexo já vem no formato correto do select (MASCULINO, FEMININO, OUTRO)
      if (payload.sexo && typeof payload.sexo === 'string') {
        payload.sexo = payload.sexo.toUpperCase();
      }

      if (!payload.senha || String(payload.senha).trim() === '') {
        delete payload.senha;
        console.log('[AtualizacaoPessoa] Senha não informada: não será alterada.');
      }

      console.log('[AtualizacaoPessoa] Enviando atualização. OrigemCarga=', this.origemCarga, 'Payload limpo=', payload);
      const idUsuario = Number(sessionStorage.getItem('userId'));
      const token = sessionStorage.getItem('authToken') || '';

      if (!token) {
        alert('Sessão expirada. Faça login novamente.');
        return;
      }

      if (!idUsuario || isNaN(idUsuario)) {
        alert('ID do usuário não encontrado. Recarregue a página.');
        return;
      }

      this.postService.putUsuario(idUsuario, payload, token).subscribe({
        next: (res) => {
          console.log('Usuário atualizado com sucesso:', res);
          alert('Dados atualizados com sucesso!');
          if (this.isEditandoOutroCliente) {
            this.router.navigate(['/menu-principal'], { state: { selectedCard: 'Clientes' } });
          }
        },
        error: (err) => {
          console.error('Erro ao atualizar usuário:', err);
          console.error('Detalhes do erro:', err.error);
          console.error('Status:', err.status);
          console.error('Mensagem:', err.message);
          
          if (err.status === 403) {
            alert('Você não tem permissão para atualizar este cadastro. Verifique se está logado corretamente.');
          } else if (err.status === 401) {
            alert('Sessão expirada. Faça login novamente.');
          } else if (err.status === 404) {
            alert('Usuário não encontrado.');
          } else if (err.status === 500) {
            const mensagemErro = err.error?.mensagem || err.error?.message || 'Erro interno do servidor';
            alert(`Erro no servidor: ${mensagemErro}`);
          } else {
            alert('Erro ao atualizar cadastro. Tente novamente.');
          }
        }
      });
    } else {
      console.log('Formulário inválido');
      alert('Por favor, preencha todos os campos obrigatórios.');
    }
  }

  cancelar() {
    this.ngOnInit();
  }

  voltar() {
    console.log('[AtualizacaoPessoa] Debug voltar() - userRole:', this.userRole, 'isCliente():', this.isCliente(), 'isEditandoOutroCliente:', this.isEditandoOutroCliente);
    
    if (this.isCliente()) {
      // Se é um cliente (independente de como chegou aqui), volta para o perfil
      console.log('[AtualizacaoPessoa] Cliente voltando para perfil');
      this.router.navigate(['/menu-principal'], { state: { selectedCard: 'Dados cadastrais' } });
    } else if (this.isEditandoOutroCliente) {
      // Se é funcionário/admin editando outro cliente, volta para a lista de clientes
      console.log('[AtualizacaoPessoa] Funcionário/Admin voltando para lista de clientes');
      this.router.navigate(['/menu-principal'], { state: { selectedCard: 'Clientes' } });
    } else {
      // Outros casos (funcionário/admin editando próprio perfil)
      console.log('[AtualizacaoPessoa] Funcionário/Admin voltando para menu principal');
      this.router.navigate(['/menu-principal']);
    }
  }
}