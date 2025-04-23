package com.exemplo.alunoapi.controller;

import com.exemplo.alunoapi.dto.AlunoRequestDTO;
import com.exemplo.alunoapi.dto.AlunoResponseDTO;
import com.exemplo.alunoapi.model.Aluno;
import com.exemplo.alunoapi.model.StatusAluno;
import com.exemplo.alunoapi.service.AlunoService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/alunos")
public class AlunoController {

    @Autowired
    private AlunoService alunoService;

    @GetMapping
    public ResponseEntity<Page<AlunoResponseDTO>> listarComFiltros(
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Double notaMin,
            Pageable pageable
    ) {
        StatusAluno statusEnum = null;
        if (status != null && !status.isEmpty()) {
            statusEnum = StatusAluno.fromDescricao(status);
        }

        Page<Aluno> alunos = alunoService.buscar(nome, statusEnum, notaMin, pageable);
        Page<AlunoResponseDTO> dtoPage = alunos.map(alunoService::toResponseDTO);

        return ResponseEntity.ok(dtoPage);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AlunoResponseDTO> buscarPorId(@PathVariable Long id) {
        Aluno aluno = alunoService.buscarPorId(id);
        return ResponseEntity.ok(alunoService.toResponseDTO(aluno));
    }

    @PostMapping
    public ResponseEntity<AlunoResponseDTO> adicionar(@RequestBody @Valid AlunoRequestDTO dto) {
        Aluno aluno = alunoService.fromRequestDTO(dto);
        Aluno salvo = alunoService.salvar(aluno);
        return ResponseEntity.ok(alunoService.toResponseDTO(salvo));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AlunoResponseDTO> atualizar(@PathVariable Long id, @RequestBody @Valid AlunoRequestDTO dto) {
        Aluno novoAluno = alunoService.fromRequestDTO(dto);
        Aluno atualizado = alunoService.atualizar(id, novoAluno);
        return ResponseEntity.ok(alunoService.toResponseDTO(atualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        alunoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
