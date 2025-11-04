export interface ListaEmprestimoModel {   
    idEmprestimo: number,
    status: string,
    idPessoa: number,
    multa: {
        idMulta: number,
        valor: number,
        statusPagamento: string
    }
}
