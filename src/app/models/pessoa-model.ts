import { Cpf } from './cpf';
import { Telefone } from './telefone';
import { Email } from './email';
import { Authority } from './authority';
import { Endereco } from './endereco';

export type Sexo = 'MASCULINO' | 'FEMININO' | string;
export type StatusConta = 'ATIVA' | 'INATIVA' | string;
export type Funcao = 'CLIENTE' | 'FUNCIONARIO' | string;

export interface PessoaModel {
  idPessoa: number;
  nome: string;
  cpf: Cpf;
  sexo: Sexo;
  funcao: Funcao;
  dtNascimento: string;
  telefone: Telefone;
  email: Email;
  senhaHash: string;
  statusConta: StatusConta;
  endereco?: Endereco | null;
  password?: string;
  authorities: Authority[];
  username: string;
  enabled: boolean;
  accountNonExpired: boolean;
  credentialsNonExpired: boolean;
  accountNonLocked: boolean;
}
