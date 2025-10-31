import { Category } from './category';
import { Author } from './author';

export interface Title {
    idTitulo: number;
    nome: string;
    descricao: string;
    categorias: Category[];
    autores: Author[];
    statusAtivo: string;
}
