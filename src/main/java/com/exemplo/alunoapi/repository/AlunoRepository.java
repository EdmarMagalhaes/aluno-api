package com.exemplo.alunoapi.repository;

import com.exemplo.alunoapi.model.Aluno;
import com.exemplo.alunoapi.model.StatusAluno;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AlunoRepository extends JpaRepository<Aluno, Long> {

    @Query("SELECT a FROM Aluno a " +
           "WHERE (:nome IS NULL OR LOWER(a.nome) LIKE LOWER(CONCAT('%', :nome, '%'))) " +
           "AND (:status IS NULL OR a.status = :status) " +
           "AND (:notaMin IS NULL OR a.nota >= :notaMin)")
    Page<Aluno> findByFiltros(@Param("nome") String nome,
                              @Param("status") StatusAluno status,
                              @Param("notaMin") Double notaMin,
                              Pageable pageable);
}
