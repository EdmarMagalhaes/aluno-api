
import { useState, useEffect, useRef } from 'react';
import AlunoForm from './components/AlunoForm';
import AlunoList from './components/AlunoList';
import DeleteConfirmation from './components/DeleteConfirmation';
import { Aluno, AlunoFiltro } from './interfaces/Aluno';
import { AlunoService } from './services/AlunoService';
import './App.css';

import { toast } from "sonner";

function App() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [selectedAluno, setSelectedAluno] = useState<Aluno | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [alunoToDelete, setAlunoToDelete] = useState<Aluno | null>(null);
  const [filtro, setFiltro] = useState<AlunoFiltro>({});

  const jaMostrouAviso = useRef(false);

  const fetchAlunos = async () => {
    const tempoInicio = Date.now();

    // 👉 Exibe o toast de carregando imediatamente
    const toastId = toast.loading("Carregando alunos...");

    try {
      const data = await AlunoService.listarAlunos(filtro);

      const tempoFim = Date.now();

      toast.success("Lista de alunos carregada com sucesso!", { id: toastId });

      if (!jaMostrouAviso.current && (tempoFim - tempoInicio > 3000)) {
        toast.info("Primeiro carregamento pode demorar um pouco pois o servidor pode estar hibernando.");
        jaMostrouAviso.current = true;
      }

      if (Array.isArray(data)) {
        setAlunos(data);
      } else if (data && typeof data === 'object') {
        const arraysPossiveis = [data.content, data.data, data.items, data.alunos];
        const resultado = arraysPossiveis.find(a => Array.isArray(a));
        if (resultado) {
          setAlunos(resultado);
        } else {
          if (data.id) {
            setAlunos([data]);
          } else {
            setAlunos([]);
          }
        }
      } else {
        setAlunos([]);
      }

    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
      toast.error('Erro ao carregar alunos.', { id: toastId });
      setAlunos([]);
    }
  };

  useEffect(() => {
    fetchAlunos();
  }, [filtro]);

  const handleAddAluno = () => {
    setSelectedAluno(null);
    setIsFormVisible(true);
  };

  const handleEditAluno = (aluno: Aluno) => {
    setSelectedAluno(aluno);
    setIsFormVisible(true);
  };

  const handleDeleteAluno = (aluno: Aluno) => {
    setAlunoToDelete(aluno);
    setIsDeleteModalVisible(true);
  };

  const handleFormSubmit = async (aluno: Aluno) => {
    try {
      let novoOuAtualizadoAluno: Aluno;

      if (selectedAluno && selectedAluno.id) {
        const atualizado = await AlunoService.atualizarAluno(selectedAluno.id, aluno);
        novoOuAtualizadoAluno = atualizado as Aluno;
        setAlunos(alunos.map(a => a.id === selectedAluno.id ? novoOuAtualizadoAluno : a));
        toast.success(`Aluno ${aluno.nome} atualizado com sucesso!`);
      } else {
        const novo = await AlunoService.cadastrarAluno(aluno);
        novoOuAtualizadoAluno = novo as Aluno;
        setAlunos([...alunos, novoOuAtualizadoAluno]);
        toast.success(`Aluno ${aluno.nome} cadastrado com sucesso!`);
      }

      setIsFormVisible(false);
      fetchAlunos();

    } catch (error) {
      console.error('Erro ao salvar aluno:', error);
      toast.error('Erro ao salvar aluno.');
    }
  };

  const confirmDelete = async () => {
    if (alunoToDelete && alunoToDelete.id) {
      try {
        await AlunoService.deletarAluno(alunoToDelete.id);
        setAlunos(alunos.filter(a => a.id !== alunoToDelete.id));
        toast.success(`Aluno ${alunoToDelete.nome} excluído com sucesso!`);
        fetchAlunos();
      } catch (error) {
        console.error('Erro ao excluir aluno:', error);
        toast.error('Erro ao excluir aluno.');
      }
    }
    setIsDeleteModalVisible(false);
    setAlunoToDelete(null);
  };

  const cancelDelete = () => {
    setIsDeleteModalVisible(false);
    setAlunoToDelete(null);
  };

  const handleFiltroChange = (novoFiltro: AlunoFiltro) => {
    setFiltro(novoFiltro);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Sistema de Gerenciamento de Alunos
        </h1>
      </header>

      <div className="mb-6 flex justify-end">
        <button
          onClick={handleAddAluno}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Adicionar Novo Aluno
        </button>
      </div>

      {isFormVisible && (
        <AlunoForm
          aluno={selectedAluno || undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormVisible(false)}
        />
      )}

      <AlunoList
        alunos={alunos}
        onFiltroChange={handleFiltroChange}
        onEdit={handleEditAluno}
        onDelete={(id) => {
          const aluno = alunos.find(a => a.id === id);
          if (aluno) handleDeleteAluno(aluno);
          else toast.error('Aluno não encontrado para exclusão.');
        }}
      />

      {isDeleteModalVisible && alunoToDelete && (
        <DeleteConfirmation
          aluno={alunoToDelete}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
}

export default App;
