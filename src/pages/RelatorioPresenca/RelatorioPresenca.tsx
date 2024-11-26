import React, { useState } from 'react';
import axios from 'axios';
import SidebarMenu from '../../components/Sidebarmenu';
import './RelatorioPresenca.css';

interface Presenca {
  id: number;
  aluno: {
    id: number;
    nome: string;
  };
  curso: {
    id: number;
    nome: string;
  };
  data: string;
  presente: boolean;
  observacao?: string;
}

const RelatorioPresenca: React.FC = () => {
  const [dataBusca, setDataBusca] = useState<string>('');
  const [presencas, setPresencas] = useState<Presenca[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const buscarPresencas = async () => {
    if (!dataBusca) {
      alert('Por favor, selecione uma data.');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3333/presenca?data=${dataBusca}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPresencas(response.data);
    } catch (error) {
      console.error('Erro ao buscar presenças:', error);
      alert('Erro ao buscar presenças para a data selecionada.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <SidebarMenu />
      <div className="content-container">
        <h1>Relatório de Presença</h1>

        {/* Filtro por Data */}
        <div className="filter-container">
          <label htmlFor="data-input">Selecione uma data:</label>
          <input
            type="date"
            id="data-input"
            value={dataBusca}
            onChange={(e) => setDataBusca(e.target.value)}
          />
          <button onClick={buscarPresencas}>Buscar</button>
        </div>

        {/* Resultados */}
        {loading ? (
          <p>Carregando...</p>
        ) : presencas.length > 0 ? (
          <div className="presenca-list">
            {presencas.map((presenca) => (
              <div key={presenca.id} className="presenca-item">
                <p><strong>Aluno:</strong> {presenca.aluno.nome}</p>
                <p><strong>Curso:</strong> {presenca.curso.nome}</p>
                <p><strong>Data:</strong> {new Date(presenca.data).toLocaleDateString('pt-BR')}</p>
                <p><strong>Status:</strong> {presenca.presente ? 'Presente' : 'Ausente'}</p>
                {presenca.observacao && <p><strong>Observação:</strong> {presenca.observacao}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p>Nenhuma presença encontrada para a data selecionada.</p>
        )}
      </div>
    </div>
  );
};

export default RelatorioPresenca;
