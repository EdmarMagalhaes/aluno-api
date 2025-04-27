import React, { useState } from 'react';
import { Aluno } from '../interfaces/Aluno';

interface AlunoFormProps {
  aluno?: Aluno;
  onSubmit: (aluno: Aluno) => void;
  onCancel: () => void;
}

const AlunoForm: React.FC<AlunoFormProps> = ({ aluno, onSubmit, onCancel }) => {
  const [nome, setNome] = useState(aluno?.nome || '');
  const [nota, setNota] = useState(aluno?.nota?.toString() || '');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome.trim()) {
      setError('O nome do aluno é obrigatório');
      return;
    }
    
    const notaValue = parseFloat(nota);
    if (isNaN(notaValue) || notaValue < 0 || notaValue > 10) {
      setError('A nota deve ser um número entre 0 e 10');
      return;
    }
    
    onSubmit({
      ...aluno,
      nome,
      nota: notaValue
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">{aluno ? 'Editar Aluno' : 'Cadastrar Novo Aluno'}</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nome">
            Nome
          </label>
          <input
            id="nome"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Nome do aluno"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nota">
            Nota
          </label>
          <input
            id="nota"
            type="number"
            step="0.1"
            min="0"
            max="10"
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Nota do aluno"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {aluno ? 'Atualizar' : 'Cadastrar'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AlunoForm;
