import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SidebarMenu from '../../components/Sidebarmenu';
import './RelatorioDevedores.css';

interface Devedor {
  alunoId: number;
  cursoId: number;
  valor: number;
  status: string;
  alunoNome?: string;
  alunoCpf?: string;
  cursoNome?: string;
  telefone?: string;
  dataVencimento?: string;
  tempoDeDivida?: string;
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

        const devedoresCompletos = await Promise.all(
          devedoresData.map(async (devedor: Devedor) => {
            const alunoResponse = await axios.get(`http://localhost:3333/alunos/${devedor.alunoId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            const cursoResponse = await axios.get(`http://localhost:3333/cursos/${devedor.cursoId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            const tempoDeDivida = calcularTempoDeDivida(devedor.dataVencimento);

            return {
              ...devedor,
              alunoNome: alunoResponse.data.nome,
              alunoCpf: alunoResponse.data.cpf,
              cursoNome: cursoResponse.data.nome,
              telefone: alunoResponse.data.telefone,
              tempoDeDivida: tempoDeDivida,
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

  const calcularTempoDeDivida = (dataVencimento?: string) => {
    if (!dataVencimento) return 'Data de vencimento não informada';
    const vencimento = new Date(dataVencimento);
    const hoje = new Date();
    const diffTime = Math.abs(hoje.getTime() - vencimento.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 30 ? `${Math.floor(diffDays / 30)} meses` : `${diffDays} dias`;
  };

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
                <p><strong>Valor Devido:</strong> R$ {devedor.valor}</p>
                <p><strong>Tempo de Dívida:</strong> {devedor.tempoDeDivida}</p>
                <p><strong>Contato:</strong> {devedor.telefone}</p>
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
