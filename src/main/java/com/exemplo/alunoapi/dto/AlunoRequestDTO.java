package com.exemplo.alunoapi.dto;

import jakarta.validation.constraints.*;

public class AlunoRequestDTO {

    @NotBlank(message = "O nome é obrigatório")
    private String nome;

    @NotNull(message = "A nota é obrigatória")
    @DecimalMin(value = "0.0", inclusive = true, message = "A nota deve ser no mínimo 0.0")
    @DecimalMax(value = "10.0", inclusive = true, message = "A nota deve ser no máximo 10.0")
    private Double nota;

    public AlunoRequestDTO() {}

    public AlunoRequestDTO(String nome, Double nota) {
        this.nome = nome;
        this.nota = nota;
    }

    // Getters e Setters
    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Double getNota() {
        return nota;
    }

    public void setNota(Double nota) {
        this.nota = nota;
    }
}

