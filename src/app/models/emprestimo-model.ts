import { ExemplarModel } from "./exemplar-model"
import { PessoaModel } from "./pessoa-model"

export interface EmprestimoModel {
    idEmprestimo: number,
    dtInicioEmprestimo: string,
    dtSeparacaoExemplar: string,
    dtRetiradaExemplar: string,
    dtDevolucaoPrevista: string,
    dtDevolvidoExemplar: string|null,
    status: string,
    pessoa: PessoaModel,
    exemplar: ExemplarModel ,
    multa: {
        idMulta: number,
        valor: number,
        statusPagamento: string
    }

}
