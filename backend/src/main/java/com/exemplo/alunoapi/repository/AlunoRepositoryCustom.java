package com.exemplo.alunoapi.repository;

import com.exemplo.alunoapi.model.Aluno;
import com.exemplo.alunoapi.model.StatusAluno;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AlunoRepositoryCustom {
    Page<Aluno> findByFiltros(String nome, StatusAluno status, Double notaMin, Pageable pageable);
}
