import React from 'react';
import { Aluno } from '../interfaces/Aluno';

interface DeleteConfirmationProps {
  aluno: Aluno;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({ aluno, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4 text-red-600">Confirmar Exclusão</h2>
        <p className="mb-6">
          Tem certeza que deseja excluir o aluno <span className="font-semibold">{aluno.nome}</span>?
          Esta ação não pode ser desfeita.
        </p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
