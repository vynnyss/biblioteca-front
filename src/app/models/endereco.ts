// Endereco is nullable in the example JSON. Define common optional fields so
// it can be extended if your API returns address objects later.
export interface Endereco {
  nomeLogradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado: { idEstado: number; nome: string; statusAtivo: string; };
  pais?: string;
  cep?: string;
}
