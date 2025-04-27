import { Aluno, AlunoFiltro } from '../interfaces/Aluno';
import api from './api';

export const AlunoService = {
  listarAlunos: async (filtro?: AlunoFiltro) => {
    let url = '/alunos';
    const params: Record<string, string> = {};
    
    if (filtro) {
      if (filtro.nome) params.nome = filtro.nome;
      if (filtro.status) params.status = filtro.status;
      if (filtro.notaMin) params.notaMin = filtro.notaMin.toString();
    }
    
    const response = await api.get(url, { params });
    return response.data;
  },
  
  buscarAlunoPorId: async (id: number) => {
    const response = await api.get(`/alunos/${id}`);
    return response.data;
  },
  
  cadastrarAluno: async (aluno: Aluno) => {
    const response = await api.post('/alunos', aluno);
    return response.data;
  },
  
  atualizarAluno: async (id: number, aluno: Aluno) => {
    const response = await api.put(`/alunos/${id}`, aluno);
    return response.data;
  },
  
  deletarAluno: async (id: number) => {
    const response = await api.delete(`/alunos/${id}`);
    return response.data;
  }
};
