export interface Aluno {
  id?: number;
  nome: string;
  nota: number;
  status?: string;
}

export interface AlunoFiltro {
  nome?: string;
  status?: string;
  notaMin?: number;
}
