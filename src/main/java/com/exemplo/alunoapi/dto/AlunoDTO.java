package com.exemplo.alunoapi.dto;

import com.exemplo.alunoapi.model.Aluno;

public class AlunoDTO {
    private Long id;
    private String nome;
    private Double nota;
    private String status;

    public AlunoDTO(Aluno aluno) {
        this.id = aluno.getId();
        this.nome = aluno.getNome();
        this.nota = aluno.getNota();
        this.status = aluno.getStatus() != null ? aluno.getStatus().getDescricao() : null;
    }

    public AlunoDTO() {
    }

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
