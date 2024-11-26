import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SidebarMenu from '../../components/Sidebarmenu';
import './RelatorioDevedores.css';

interface Devedor {
  nome: string;
  cpf: string;
  curso: string;
  valorDevido?: number;
  tempoDeDivida: string;
  telefone: string;
  cursoMatriculado?: {
    id: number;
    nome: string;
    disciplinas: string[];
    cargaHoraria: number;
    diasDaSemana: string[];
    horasPorDia: number;
    financeiro: {
      id: number;
      cursoId: number;
      valor: number;
      valorOriginal: number;
      valorPago: number | null;
      desconto: number | null;
      quantidadeParcelas: number;
      status: string;
      dataPagamento: string | null;
      dataVencimento: string;
      formaPagamento: string | null;
    }[];
  };
}

const RelatorioDevedores: React.FC = () => {
  const [devedores, setDevedores] = useState<Devedor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modalDevedor, setModalDevedor] = useState<Devedor | null>(null);
  const [observacoes, setObservacoes] = useState<{ [cpf: string]: string }>({}); // Observações salvas em cache

  // Função para buscar os devedores
  const fetchDevedores = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3333/relatorios/devedores', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && Array.isArray(response.data)) {
        setDevedores(response.data);
      } else {
        setError('Nenhum dado encontrado.');
      }
    } catch (error) {
      console.error('Erro ao buscar devedores:', error);
      setError('Erro ao carregar os dados dos devedores. Verifique sua conexão ou tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleDevedorClick = (devedor: Devedor) => {
    setModalDevedor(devedor);
  };

  const handleObservacaoChange = (cpf: string, texto: string) => {
    setObservacoes((prev) => ({ ...prev, [cpf]: texto }));
  };

  useEffect(() => {
    fetchDevedores();
  }, []);

  return (
    <div className="page-container">
      <SidebarMenu />
      <div className="content-container">
        <h1>Relatório de Devedores</h1>

        {error && <p className="error-message">{error}</p>}

        <div className="relatorio-lista">
          {loading ? (
            <p>Carregando...</p>
          ) : devedores.length > 0 ? (
            devedores.map((devedor, index) => (
              <div key={index} className="devedor-item" onClick={() => handleDevedorClick(devedor)}>
                <p><strong>Nome:</strong> {devedor.nome || 'Não informado'}</p>
                <p><strong>CPF:</strong> {devedor.cpf || 'Não informado'}</p>
                <p><strong>Curso:</strong> {devedor.curso || 'Não informado'}</p>
                <p>
                  <strong>Valor Devido:</strong> R$ {devedor.valorDevido !== undefined ? devedor.valorDevido.toFixed(2) : '0.00'}
                </p>
                <p><strong>Contato:</strong> {devedor.telefone || 'Não informado'}</p>
              </div>
            ))
          ) : (
            <p>Nenhum devedor encontrado.</p>
          )}
        </div>
      </div>

      {/* Modal */}
      {/* Modal */}
        {/* Modal */}
        {modalDevedor && (
          <div className="modal-popup">
            <div className="popup-content">
              <h2>Detalhes do Devedor</h2>
              <p><strong>Nome:</strong> {modalDevedor.nome}</p>
              <p><strong>Contato:</strong> {modalDevedor.telefone}</p>
              <p>
                <strong>Valor Total Devido:</strong> R$ 
                {modalDevedor.valorDevido !== undefined 
                  ? modalDevedor.valorDevido.toFixed(2) 
                  : '0.00'}
              </p>
              <label>
                <strong>Observação:</strong>
                <textarea
                  value={observacoes[modalDevedor.cpf] || ''}
                  onChange={(e) => handleObservacaoChange(modalDevedor.cpf, e.target.value)}
                  placeholder="Adicione uma observação..."
                />
              </label>
              <div className="modal-buttons">
                <button onClick={() => setModalDevedor(null)}>Fechar</button>
              </div>
            </div>
          </div>
        )}


    </div>
  );
};

export default RelatorioDevedores;
