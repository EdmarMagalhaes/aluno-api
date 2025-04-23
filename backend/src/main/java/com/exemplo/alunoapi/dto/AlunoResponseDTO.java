package com.exemplo.alunoapi.dto;

import com.exemplo.alunoapi.model.StatusAluno;

public class AlunoResponseDTO {

    private Long id;
    private String nome;
    private Double nota;
    private String status;

    public AlunoResponseDTO() {
    }

    public AlunoResponseDTO(Long id, String nome, Double nota, StatusAluno status) {
        this.id = id;
        this.nome = nome;
        this.nota = nota;
        this.status = status != null ? status.getDescricao() : null;
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
