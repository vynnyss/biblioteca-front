import { Title } from './title';
import { Publisher } from './publisher';
import { Language } from './language';

export interface BookModel {
    idEdicao: number;
    tipoCapa: string;
    qtdPaginas: number;
    tamanho: string;
    classificacao: string;
    dtPublicacao: string;
    titulo: Title;
    editora: Publisher;
    idioma: Language;
    statusAtivo: string;
    imagemUrl?: string;
}
