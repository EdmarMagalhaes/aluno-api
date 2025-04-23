package com.exemplo.alunoapi.exception;

public class AlunoFiltroVazioException extends RuntimeException {

    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public AlunoFiltroVazioException() {
        super("Nenhum aluno encontrado com os filtros informados.");
    }
}
