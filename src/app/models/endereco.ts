// Endereco is nullable in the example JSON. Define common optional fields so
// it can be extended if your API returns address objects later.
export interface Endereco {
  rua?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  pais?: string;
  cep?: string;
}
