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

  // ✅ Para controlar se o toast de lentidão já foi mostrado
  const jaMostrouAviso = useRef(false);

  const fetchAlunos = async () => {
    const tempoInicio = Date.now();
    try {
      const data = await AlunoService.listarAlunos(filtro);

      const tempoFim = Date.now();

      // ✅ Mostra aviso só no primeiro carregamento e se demorar
      if (!jaMostrouAviso.current && (tempoFim - tempoInicio > 3000)) {
        toast.info("Este é um sistema protótipo. O primeiro carregamento pode demorar um pouco devido à hibernação do servidor.");
        jaMostrouAviso.current = true;
      }

      // ✅ Normalização da resposta da API
      if (Array.isArray(data)) {
        setAlunos(data);
      } else if (data && typeof data === 'object') {
        if (Array.isArray(data.content)) {
          setAlunos(data.content);
        } else if (Array.isArray(data.data)) {
          setAlunos(data.data);
        } else if (Array.isArray(data.items)) {
          setAlunos(data.items);
        } else if (Array.isArray(data.alunos)) {
          setAlunos(data.alunos);
        } else {
          if (data.id) {
            setAlunos([data]);
          } else {
            const alunosArray = Object.values(data).filter(item =>
              item && typeof item === 'object' && 'nome' in item && 'nota' in item
            );
            if (alunosArray.length > 0) {
              setAlunos(alunosArray as Aluno[]);
            } else {
              setAlunos([]);
              console.error('Resposta inesperada da API:', data);
            }
          }
        }
      } else {
        console.error('Resposta da API não reconhecida:', data);
        setAlunos([]);
      }

    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
      toast.error('Erro ao carregar a lista de alunos.');
      setAlunos([]);
    }
  };

  useEffect(() => {
    fetchAlunos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

        const alunosAtualizados = alunos.map(a =>
          a.id === selectedAluno.id ? { ...a, ...novoOuAtualizadoAluno } : a
        );
        setAlunos(alunosAtualizados);

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
      toast.error('Erro ao salvar aluno. Tente novamente.');
    }
  };

  const confirmDelete = async () => {
    if (alunoToDelete && alunoToDelete.id) {
      try {
        await AlunoService.deletarAluno(alunoToDelete.id);

        const alunosAtualizados = alunos.filter(a => a.id !== alunoToDelete.id);
        setAlunos(alunosAtualizados);

        toast.success(`Aluno ${alunoToDelete.nome} excluído com sucesso!`);

        fetchAlunos();

      } catch (error) {
        console.error('Erro ao excluir aluno:', error);
        toast.error('Erro ao excluir aluno. Tente novamente.');
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
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Adicionar Novo Aluno
        </button>
      </div>

      {isFormVisible && (
        <div className="mb-8">
          <AlunoForm
            aluno={selectedAluno || undefined}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormVisible(false)}
          />
        </div>
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
