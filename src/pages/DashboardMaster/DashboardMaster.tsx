import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SidebarMenu from '../../components/Sidebarmenu';
import './DashboardMaster.css';

interface Aluno {
  id: number;
  nome: string;
  cpf: string;
  cursoMatriculado: string;
}

interface Devedor {
  id: number;
  alunoId: number;
  status: string;
}

interface Recebimento {
  id: number;
  valorPago: number;
  status: string;
}

const DashboardMaster: React.FC = () => {
  const [totalDevedores, setTotalDevedores] = useState(0);
  const [totalAlunos, setTotalAlunos] = useState(0);
  const [recebimentoMensal, setRecebimentoMensal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchData = async () => {
      setIsLoading(true);
      setError('');
    
      try {
        const [devedoresResponse, alunosResponse, recebimentosResponse] = await Promise.all([
          axios.get<Devedor[]>('http://localhost:3333/relatorios/devedores', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get<Aluno[]>('http://localhost:3333/relatorios/alunos', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get<{ totalRecebido: number }>('http://localhost:3333/relatorios/recebimentos-mensais', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
    
        setTotalDevedores(devedoresResponse.data.length);
        setTotalAlunos(alunosResponse.data.length);
        setRecebimentoMensal(recebimentosResponse.data.totalRecebido); // Acessa o total direto
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setError('Erro ao buscar dados do dashboard. Tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    };
    
    

    fetchData();
  }, []);

  return (
    <div className="dashboard-container">
      <SidebarMenu />
      <div className="main-content">
        <h1>Dashboard Master</h1>
        {isLoading ? (
          <p>Carregando...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <div className="info-cards">
            <div className="info-card">
              <h2>Total de Devedores</h2>
              <p>{totalDevedores}</p>
            </div>
            <div className="info-card">
              <h2>Total de Alunos</h2>
              <p>{totalAlunos}</p>
            </div>
            <div className="info-card">
              <h2>Recebimento Mensal</h2>
              <p>R$ {recebimentoMensal.toFixed(2)}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardMaster;
