import React, { useState, useEffect } from 'react';
import AlunoForm from './components/AlunoForm';
import AlunoList from './components/AlunoList';
import DeleteConfirmation from './components/DeleteConfirmation';
import Notification from './components/Notification';
import { Aluno, AlunoFiltro } from './interfaces/Aluno';
import { AlunoService } from './services/AlunoService';
import './App.css';

function App() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [selectedAluno, setSelectedAluno] = useState<Aluno | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [alunoToDelete, setAlunoToDelete] = useState<Aluno | null>(null);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [filtro, setFiltro] = useState<AlunoFiltro>({});

  const fetchAlunos = async () => {
    try {
      const data = await AlunoService.listarAlunos(filtro);
      
      // Verifica se a resposta é um array
      if (Array.isArray(data)) {
        setAlunos(data);
      } else if (data && typeof data === 'object') {
        // Se for um objeto, verifica se tem uma propriedade que contém o array de alunos
        if (Array.isArray(data.content)) {
          setAlunos(data.content);
        } else if (Array.isArray(data.data)) {
          setAlunos(data.data);
        } else if (Array.isArray(data.items)) {
          setAlunos(data.items);
        } else if (Array.isArray(data.alunos)) {
          setAlunos(data.alunos);
        } else {
          // Se não encontrar um array em propriedades comuns, tenta converter o objeto em array
          console.log('Formato de resposta da API:', data);
          // Se for um único objeto, coloca em um array
          if (data.id) {
            setAlunos([data]);
          } else {
            // Último recurso: tenta converter as propriedades do objeto em um array
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
        // Se não for nem array nem objeto, define como array vazio
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
      let novoOuAtualizadoAluno;
      
      if (selectedAluno && selectedAluno.id) {
        // Atualizar aluno existente
        novoOuAtualizadoAluno = await AlunoService.atualizarAluno(selectedAluno.id, aluno);
        
        // Atualiza a lista instantaneamente
        if (Array.isArray(alunos)) {
          const alunosAtualizados = alunos.map(a => 
            a.id === selectedAluno.id ? { ...a, ...novoOuAtualizadoAluno } : a
          );
          setAlunos(alunosAtualizados);
        }
        
        showNotification(`Aluno ${aluno.nome} atualizado com sucesso!`, 'success');
      } else {
        // Cadastrar novo aluno
        novoOuAtualizadoAluno = await AlunoService.cadastrarAluno(aluno);
        
        // Adiciona o novo aluno à lista instantaneamente
        if (Array.isArray(alunos)) {
          setAlunos([...alunos, novoOuAtualizadoAluno]);
        } else {
          setAlunos([novoOuAtualizadoAluno]);
        }
        
        showNotification(`Aluno ${aluno.nome} cadastrado com sucesso!`, 'success');
      }
      
      setIsFormVisible(false);
      
      // Atualiza a lista completa em segundo plano para garantir sincronização
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
        
        // Remove o aluno da lista instantaneamente
        if (Array.isArray(alunos)) {
          const alunosAtualizados = alunos.filter(a => a.id !== alunoToDelete.id);
          setAlunos(alunosAtualizados);
        }
        
        showNotification(`Aluno ${alunoToDelete.nome} excluído com sucesso!`, 'success');
        
        // Atualiza a lista completa em segundo plano para garantir sincronização
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
        <h1 className="text-3xl font-bold text-center text-gray-800">Sistema de Gerenciamento de Alunos</h1>
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
          // Garantir que alunos é um array antes de usar find
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
