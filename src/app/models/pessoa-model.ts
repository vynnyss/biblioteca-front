import { Cpf } from './cpf';
import { Telefone } from './telefone';
import { Email } from './email';
import { Authority } from './authority';
import { Endereco } from './endereco';

export type Sexo = 'MASCULINO' | 'FEMININO' | string;
export type StatusConta = 'ATIVA' | 'INATIVA' | string;
export type Funcao = 'CLIENTE' | 'FUNCIONARIO' | string;

export interface Pessoa {
  idPessoa: number;
  nome: string;
  cpf: Cpf;
  sexo: Sexo;
  funcao: Funcao;
  dtNascimento: string; // ISO date string, e.g. '1962-11-20'
  telefone: Telefone;
  email: Email;
  senhaHash: string;
  statusConta: StatusConta;
  endereco?: Endereco | null;
  // Some APIs include both hashed/sensitive fields and a `password` key.
  // Keep both as strings to match the JSON example.
  password?: string;
  authorities: Authority[];
  username: string;
  enabled: boolean;
  accountNonExpired: boolean;
  credentialsNonExpired: boolean;
  accountNonLocked: boolean;
}
