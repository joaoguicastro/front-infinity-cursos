import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SidebarMenu from '../../components/Sidebarmenu'; // Importar o componente de menu
import './RelatorioDevedores.css'; // Importar o CSS para estilização

interface Devedor {
  alunoId: number;
  cursoId: number;
  valor: number;
  status: string;
  alunoNome?: string;
  alunoCpf?: string;
  cursoNome?: string;
}

const RelatorioDevedores: React.FC = () => {
  const [devedores, setDevedores] = useState<Devedor[]>([]);

  useEffect(() => {
    const fetchDevedores = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3333/relatorios/devedores', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const devedoresData = response.data;

        // Para cada devedor, buscar o nome do aluno e do curso
        const devedoresCompletos = await Promise.all(
          devedoresData.map(async (devedor: Devedor) => {
            const alunoResponse = await axios.get(`http://localhost:3333/alunos/${devedor.alunoId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            const cursoResponse = await axios.get(`http://localhost:3333/cursos/${devedor.cursoId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            return {
              ...devedor,
              alunoNome: alunoResponse.data.nome,
              alunoCpf: alunoResponse.data.cpf,
              cursoNome: cursoResponse.data.nome,
            };
          })
        );

        setDevedores(devedoresCompletos);
      } catch (error) {
        console.error('Erro ao buscar devedores:', error);
      }
    };

    fetchDevedores();
  }, []);

  return (
    <div className="page-container">
      <SidebarMenu />
      <div className="content-container">
        <h1>Relatório de Devedores</h1>
        <div className="relatorio-lista">
          {devedores.length > 0 ? (
            devedores.map((devedor, index) => (
              <div key={index} className="devedor-item">
                <p><strong>Nome:</strong> {devedor.alunoNome}</p>
                <p><strong>CPF:</strong> {devedor.alunoCpf}</p>
                <p><strong>Curso:</strong> {devedor.cursoNome}</p>
                <p><strong>Valor:</strong> R$ {devedor.valor}</p>
                <p><strong>Status:</strong> {devedor.status}</p>
              </div>
            ))
          ) : (
            <p>Nenhum devedor encontrado.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RelatorioDevedores;
