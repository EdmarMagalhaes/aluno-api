package com.exemplo.alunoapi.repository;

import com.exemplo.alunoapi.model.Aluno;
import com.exemplo.alunoapi.model.StatusAluno;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class AlunoRepositoryCustomImpl implements AlunoRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Page<Aluno> findByFiltros(String nome, StatusAluno status, Double notaMin, Pageable pageable) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        
        // Consulta principal para buscar alunos
        CriteriaQuery<Aluno> query = cb.createQuery(Aluno.class);
        Root<Aluno> alunoRoot = query.from(Aluno.class);

        List<Predicate> predicates = new ArrayList<>();

        if (nome != null && !nome.isEmpty()) {
            predicates.add(cb.like(cb.lower(alunoRoot.get("nome")), "%" + nome.toLowerCase() + "%"));
        }
        if (status != null) {
            predicates.add(cb.equal(alunoRoot.get("status"), status));
        }
        if (notaMin != null) {
            predicates.add(cb.greaterThanOrEqualTo(alunoRoot.get("nota"), notaMin));
        }

        query.where(cb.and(predicates.toArray(new Predicate[0])));

        var typedQuery = entityManager.createQuery(query);
        typedQuery.setFirstResult((int) pageable.getOffset());
        typedQuery.setMaxResults(pageable.getPageSize());

        List<Aluno> resultList = typedQuery.getResultList();

        // Consulta separada para contar o total de registros
        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<Aluno> countRoot = countQuery.from(Aluno.class);

        List<Predicate> countPredicates = new ArrayList<>();

        if (nome != null && !nome.isEmpty()) {
            countPredicates.add(cb.like(cb.lower(countRoot.get("nome")), "%" + nome.toLowerCase() + "%"));
        }
        if (status != null) {
            countPredicates.add(cb.equal(countRoot.get("status"), status));
        }
        if (notaMin != null) {
            countPredicates.add(cb.greaterThanOrEqualTo(countRoot.get("nota"), notaMin));
        }

        countQuery.select(cb.count(countRoot)).where(cb.and(countPredicates.toArray(new Predicate[0])));
        Long total = entityManager.createQuery(countQuery).getSingleResult();

        return new PageImpl<>(resultList, pageable, total);
    }
}
