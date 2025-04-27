import React, { useState } from 'react';
import { Aluno, AlunoFiltro } from '../interfaces/Aluno';

interface AlunoListProps {
  alunos: Aluno[];
  onEdit: (aluno: Aluno) => void;
  onDelete: (id: number) => void;
  onFiltroChange: (filtro: AlunoFiltro) => void;
}

const AlunoList: React.FC<AlunoListProps> = ({ alunos, onEdit, onDelete, onFiltroChange }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Estados para os campos de filtro
  const [nomeFiltro, setNomeFiltro] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('');
  const [notaMinimaFiltro, setNotaMinimaFiltro] = useState('');

  const aplicarFiltros = () => {
    const novoFiltro: AlunoFiltro = {};
    
    if (nomeFiltro.trim()) novoFiltro.nome = nomeFiltro.trim();
    
    // Corrigindo o formato do status para incluir "Aluno " antes
    if (statusFiltro) {
      if (statusFiltro === 'Aprovado') {
        novoFiltro.status = 'Aluno Aprovado';
      } else if (statusFiltro === 'Reprovado') {
        novoFiltro.status = 'Aluno Reprovado';
      }
    }
    
    // Corrigindo o nome do parâmetro para nota mínima (notaMin em vez de notaMinima)
    if (notaMinimaFiltro) novoFiltro.notaMin = parseFloat(notaMinimaFiltro);
    
    onFiltroChange(novoFiltro);
    setLoading(true);
    // O loading será desativado quando o componente pai atualizar a lista de alunos
    setTimeout(() => setLoading(false), 500);
  };

  const limparFiltros = () => {
    setNomeFiltro('');
    setStatusFiltro('');
    setNotaMinimaFiltro('');
    onFiltroChange({});
    setLoading(true);
    // O loading será desativado quando o componente pai atualizar a lista de alunos
    setTimeout(() => setLoading(false), 500);
  };

  const getStatusClass = (status: string) => {
    return status?.includes('Aprovado') 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Lista de Alunos</h2>
      
      {/* Filtros */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Nome
            </label>
            <input
              type="text"
              value={nomeFiltro}
              onChange={(e) => setNomeFiltro(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Filtrar por nome"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Status
            </label>
            <select
              value={statusFiltro}
              onChange={(e) => setStatusFiltro(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Todos</option>
              <option value="Aprovado">Aprovado</option>
              <option value="Reprovado">Reprovado</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Nota Mínima
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              value={notaMinimaFiltro}
              onChange={(e) => setNotaMinimaFiltro(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Nota mínima"
            />
          </div>
        </div>
        
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={limparFiltros}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Limpar
          </button>
          <button
            onClick={aplicarFiltros}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Aplicar Filtros
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="text-center py-4">
          <p className="text-gray-600">Carregando alunos...</p>
        </div>
      ) : alunos.length === 0 ? (
        <div className="text-center py-4 bg-gray-50 rounded">
          <p className="text-gray-600">Nenhum aluno encontrado.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">ID</th>
                <th className="py-3 px-6 text-left">Nome</th>
                <th className="py-3 px-6 text-center">Nota</th>
                <th className="py-3 px-6 text-center">Status</th>
                <th className="py-3 px-6 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {alunos.map((aluno) => (
                <tr key={aluno.id || Math.random()} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6 text-left">{aluno.id}</td>
                  <td className="py-3 px-6 text-left">{aluno.nome}</td>
                  <td className="py-3 px-6 text-center">{aluno.nota?.toFixed(1)}</td>
                  <td className="py-3 px-6 text-center">
                    <span className={`py-1 px-3 rounded-full text-xs ${getStatusClass(aluno.status || '')}`}>
                      {aluno.status}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex item-center justify-center">
                      <button
                        onClick={() => onEdit(aluno)}
                        className="transform hover:text-blue-500 hover:scale-110 mr-3"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onDelete(aluno.id!)}
                        className="transform hover:text-red-500 hover:scale-110"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AlunoList;
