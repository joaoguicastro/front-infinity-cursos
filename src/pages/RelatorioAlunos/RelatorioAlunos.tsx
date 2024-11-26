import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SidebarMenu from '../../components/Sidebarmenu';
import './RelatorioAlunos.css';

const RelatorioAlunos: React.FC = () => {
  const [alunos, setAlunos] = useState<any[]>([]);
  const [filtroNome, setFiltroNome] = useState('');
  const [alunosFiltrados, setAlunosFiltrados] = useState<any[]>([]);
  const [showAlunos, setShowAlunos] = useState(false);
  const navigate = useNavigate(); // Utilizar o hook de navegação do react-router-dom

  // Função para buscar alunos com o curso associado
  const fetchAlunos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3333/relatorios/alunos', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      setAlunos(response.data);
      setAlunosFiltrados(response.data);
      setShowAlunos(true);
    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
    }
  };

  // Função para filtrar alunos pelo nome ao clicar no botão
  const filtrarPorNome = () => {
    if (!filtroNome.trim()) {
      setAlunosFiltrados(alunos); // Mostra todos os alunos se o filtro estiver vazio
      return;
    }

    const alunosFiltrados = alunos.filter((aluno) =>
      aluno.nome.toLowerCase().includes(filtroNome.toLowerCase())
    );
    setAlunosFiltrados(alunosFiltrados);
    setShowAlunos(true);
  };

  // Função para navegar para a página de detalhes do aluno
  const handleVerDetalhes = (alunoId: number) => {
    navigate(`/alunos/${alunoId}`);
  };

  return (
    <div className="page-container-aluno">
      <SidebarMenu />
      <div className="content-container">
        <h1>Relatório de Alunos</h1>
        <div className="input-group">
          <input
            type="text"
            value={filtroNome}
            onChange={(e) => setFiltroNome(e.target.value)}
            placeholder="Buscar por nome ou parte do nome"
          />
          <button onClick={filtrarPorNome}>Buscar</button>
          <button onClick={fetchAlunos}>Listar Todos</button>
        </div>

        {showAlunos && (
          <div className="alunos-list">
            {alunosFiltrados.length > 0 ? (
              alunosFiltrados.map((aluno) => (
                <div key={aluno.id} className="aluno-item">
                  <p><strong>Nome:</strong> {aluno.nome}</p>
                  <p><strong>CPF:</strong> {aluno.cpf}</p>
                  <p><strong>Curso:</strong> {aluno.cursoMatriculado?.nome || 'Nenhum curso'}</p>
                  <button onClick={() => handleVerDetalhes(aluno.id)}>Ver Detalhes</button>
                </div>
              ))
            ) : (
              <p>Nenhum aluno encontrado.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RelatorioAlunos;
