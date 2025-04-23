package com.exemplo.alunoapi.model;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Aluno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    private Double nota;

    @Enumerated(EnumType.STRING)
    private StatusAluno status;

    public Aluno() {
    }

    public Aluno(Long id, String nome, Double nota, StatusAluno status) {
        this.id = id;
        this.nome = nome;
        this.nota = nota;
        this.status = status;
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
        atualizarStatus();
    }

    public StatusAluno getStatus() {
        return status;
    }

    public void setStatus(StatusAluno status) {
        this.status = status;
    }

    public void atualizarStatus() {
        if (this.nota == null) {
            this.status = null;
        } else if (this.nota >= 7.0) {
            this.status = StatusAluno.APROVADO;
        } else {
            this.status = StatusAluno.REPROVADO;
        }
    }
}
