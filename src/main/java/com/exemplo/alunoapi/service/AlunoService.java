package com.exemplo.alunoapi.service;

import com.exemplo.alunoapi.dto.AlunoRequestDTO;
import com.exemplo.alunoapi.dto.AlunoResponseDTO;
import com.exemplo.alunoapi.exception.AlunoFiltroVazioException;
import com.exemplo.alunoapi.exception.AlunoNotFoundException;
import com.exemplo.alunoapi.model.Aluno;
import com.exemplo.alunoapi.model.StatusAluno;
import com.exemplo.alunoapi.repository.AlunoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class AlunoService {

    @Autowired
    private AlunoRepository alunoRepository;

    // Buscar com filtros: nome, status e nota mínima
    public Page<Aluno> buscar(String nome, StatusAluno status, Double notaMin, Pageable pageable) {
        Page<Aluno> resultado = alunoRepository.findByFiltros(nome, status, notaMin, pageable);
        if (resultado.isEmpty()) {
            throw new AlunoFiltroVazioException();
        }
        return resultado;
    }

    // Buscar por ID
    public Aluno buscarPorId(Long id) {
        return alunoRepository.findById(id)
                .orElseThrow(() -> new AlunoNotFoundException(id));
    }

    // Listar todos paginados
    public Page<Aluno> listarTodos(Pageable pageable) {
        return alunoRepository.findAll(pageable);
    }

    // Salvar novo aluno
    public Aluno salvar(Aluno aluno) {
        aluno.atualizarStatus(); // calcula o status com base na nota
        return alunoRepository.save(aluno);
    }

    // Atualizar aluno existente
    public Aluno atualizar(Long id, Aluno novoAluno) {
        Aluno existente = buscarPorId(id);

        existente.setNome(novoAluno.getNome());
        existente.setNota(novoAluno.getNota());
        existente.atualizarStatus(); // atualiza o status baseado na nova nota

        return alunoRepository.save(existente);
    }

    // Deletar por ID
    public void deletar(Long id) {
        Aluno aluno = buscarPorId(id);
        alunoRepository.delete(aluno);
    }
    
    //DTOs
    
    public AlunoResponseDTO toResponseDTO(Aluno aluno) {
        return new AlunoResponseDTO(
            aluno.getId(),
            aluno.getNome(),
            aluno.getNota(),
            aluno.getStatus()
        );
    }
    
    public Aluno fromRequestDTO(AlunoRequestDTO dto) {
        Aluno aluno = new Aluno();
        aluno.setNome(dto.getNome());
        aluno.setNota(dto.getNota());
        aluno.atualizarStatus(); // calcula o status com base na nota
        return aluno;
    }


}
