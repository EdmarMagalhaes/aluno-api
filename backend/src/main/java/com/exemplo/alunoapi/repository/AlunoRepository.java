package com.exemplo.alunoapi.repository;

import com.exemplo.alunoapi.model.Aluno;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlunoRepository extends JpaRepository<Aluno, Long>, AlunoRepositoryCustom {
}
