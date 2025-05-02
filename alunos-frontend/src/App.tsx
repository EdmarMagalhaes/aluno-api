import React, { useState, useEffect, useRef } from 'react';
import AlunoForm from './components/AlunoForm';
import AlunoList from './components/AlunoList';
import DeleteConfirmation from './components/DeleteConfirmation';
import Notification from './components/Notification';
import { Aluno, AlunoFiltro } from './interfaces/Aluno';
import { AlunoService } from './services/AlunoService';
import './App.css';
import { useToast } from "@/hooks/use-toast";



function App() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [selectedAluno, setSelectedAluno] = useState<Aluno | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [alunoToDelete, setAlunoToDelete] = useState<Aluno | null>(null);
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [filtro, setFiltro] = useState<AlunoFiltro>({});

  // Controle para mostrar o aviso só uma vez
  const jaMostrouAviso = useRef(false);

  const { toast } = useToast();

  const fetchAlunos = async () => {
    const tempoInicio = Date.now();
    try {
      const data = await AlunoService.listarAlunos(filtro);

      const tempoFim = Date.now();

      if (!jaMostrouAviso.current && (tempoFim - tempoInicio > 3000)) {
        toast({
          title: "Atenção",
          description: "Este é um sistema protótipo. O primeiro carregamento pode demorar um pouco devido à hibernação do servidor.",
          variant: "default",
          duration: 5000
        });
        jaMostrouAviso.current = true;
      }

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
          console.log('Formato de resposta da API:', data);
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
              console.error('Não foi possível converter a resposta da API em um array de alunos:', data);
            }
          }
        }
      } else {
        console.error('Resposta da API em formato desconhecido:', data);
        setAlunos([]);
      }
    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
      showNotification('Erro ao carregar a lista de alunos', 'error');
      setAlunos([]);
    }
  };

  useEffect(() => {
    fetchAlunos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtro]);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

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

        if (Array.isArray(alunos)) {
          const alunosAtualizados = alunos.map(a =>
            a.id === selectedAluno.id ? { ...a, ...novoOuAtualizadoAluno } : a
          );
          setAlunos(alunosAtualizados);
        }

        showNotification(`Aluno ${aluno.nome} atualizado com sucesso!`, 'success');

      } else {
        const novo = await AlunoService.cadastrarAluno(aluno);
        novoOuAtualizadoAluno = novo as Aluno;

        if (Array.isArray(alunos)) {
          setAlunos([...alunos, novoOuAtualizadoAluno]);
        } else {
          setAlunos([novoOuAtualizadoAluno]);
        }

        showNotification(`Aluno ${aluno.nome} cadastrado com sucesso!`, 'success');
      }

      setIsFormVisible(false);
      fetchAlunos();

    } catch (error) {
      console.error('Erro ao salvar aluno:', error);
      showNotification('Erro ao salvar aluno. Tente novamente.', 'error');
    }
  };

  const handleFormCancel = () => {
    setIsFormVisible(false);
  };

  const confirmDelete = async () => {
    if (alunoToDelete && alunoToDelete.id) {
      try {
        await AlunoService.deletarAluno(alunoToDelete.id);

        if (Array.isArray(alunos)) {
          const alunosAtualizados = alunos.filter(a => a.id !== alunoToDelete.id);
          setAlunos(alunosAtualizados);
        }

        showNotification(`Aluno ${alunoToDelete.nome} excluído com sucesso!`, 'success');
        fetchAlunos();

      } catch (error) {
        console.error('Erro ao excluir aluno:', error);
        showNotification('Erro ao excluir aluno. Tente novamente.', 'error');
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

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

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
            onCancel={handleFormCancel}
          />
        </div>
      )}

      <AlunoList
        alunos={alunos}
        onFiltroChange={handleFiltroChange}
        onEdit={handleEditAluno}
        onDelete={(id) => {
          if (Array.isArray(alunos)) {
            const aluno = alunos.find(a => a.id === id);
            if (aluno) handleDeleteAluno(aluno);
          } else {
            console.error('A variável alunos não é um array:', alunos);
            showNotification('Erro ao processar a lista de alunos', 'error');
          }
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
