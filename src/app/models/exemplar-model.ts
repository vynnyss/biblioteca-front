import { BookModel } from "./book-model";

export interface ExemplarModel {

    idExemplar: number,
    status: string,
    estadoFisico: string,
    edicao: BookModel

}
