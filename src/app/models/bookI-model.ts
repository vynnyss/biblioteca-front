export interface Category {
    idCategoria: number;
    nome: string;
    statusAtivo: string;
}

export interface Author {
    idAutor: number;
    nome: string;
    statusAtivo: string;
}

export interface Title {
    idTitulo: number;
    nome: string;
    descricao: string;
    categorias: Category[];
    autores: Author[];
    statusAtivo: string;
}

export interface Publisher {
    idEditora: number;
    nome: string;
    statusAtivo: string;
}

export interface Language {
    idIdioma: number;
    nome: string;
    statusAtivo: string;
}

export interface BookModel {
    idEdicao: number;
    tipoCapa: string;
    qtdPaginas: number;
    tamanho: string;
    classificacao: string;
    dtPublicacao: string; // ISO date string
    titulo: Title;
    editora: Publisher;
    idioma: Language;
    statusAtivo: string;
    // optional legacy fields (if some views expect them)
    cover?: string;
}
