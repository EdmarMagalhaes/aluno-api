package com.exemplo.alunoapi.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum StatusAluno {
    APROVADO("Aluno aprovado"),
    REPROVADO("Aluno reprovado");

    private final String descricao;

    StatusAluno(String descricao) {
        this.descricao = descricao;
    }

    @JsonValue
    public String getDescricao() {
        return descricao;
    }

    @JsonCreator
    public static StatusAluno fromDescricao(String descricao) {
        for (StatusAluno status : StatusAluno.values()) {
            if (status.descricao.equalsIgnoreCase(descricao)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Status inválido: " + descricao);
    }
}
