package com.exemplo.alunoapi.exception;

public class AlunoNotFoundException extends RuntimeException {
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public AlunoNotFoundException(Long id) {
        super("Aluno com ID " + id + " não encontrado.");
    }
}
