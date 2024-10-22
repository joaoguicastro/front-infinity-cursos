import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RelatorioAlunoDetalhes.css'; // CSS para estilização

const RelatorioAlunoDetalhes: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Pega o ID da URL
  const navigate = useNavigate(); // Hook para navegação
  const [aluno, setAluno] = useState<any>(null); // Estado para armazenar os detalhes do aluno
  const [activeTab, setActiveTab] = useState('curso'); // Estado para controlar a aba ativa
  const [loading, setLoading] = useState(true); // Estado para controle de carregamento
  const [showModal, setShowModal] = useState(false); // Controle para o modal
  const [parcelaSelecionada, setParcelaSelecionada] = useState<any>(null); // Parcela a ser dada baixa
  const [metodoPagamento, setMetodoPagamento] = useState('pix'); // Método de pagamento selecionado
  const [descontoPercentual, setDescontoPercentual] = useState(0); // Desconto aplicado em %
  const [valorPago, setValorPago] = useState(0); // Valor pago
  const [multa, setMulta] = useState(0); // Multa caso exista

  // Função para buscar os dados do aluno
  const fetchAluno = async () => {
    try {
      const token = localStorage.getItem('token'); // Obtém o token de autenticação
      const response = await axios.get(`http://localhost:3333/alunos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Envia o token no cabeçalho
        },
      });
      setAluno(response.data); // Define os dados do aluno no estado
      setLoading(false); // Remove o estado de carregamento
    } catch (error) {
      console.error('Erro ao buscar detalhes do aluno:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchAluno();
    }
  }, [id]);

  const handleVoltar = () => {
    navigate('/relatorio-alunos'); // Redireciona para a página de relatórios de alunos
  };

  const abrirModalBaixa = (parcela: any) => {
    setParcelaSelecionada(parcela);
    setShowModal(true);
    setValorPago(parcela.valor); // Valor inicial é o valor total da parcela
    setMulta(0); // Pode ser calculado baseado no vencimento, ou definido pelo usuário
  };

  // Função para calcular o valor com desconto
  const calcularValorComDesconto = () => {
    const desconto = (parcelaSelecionada.valor * descontoPercentual) / 100;
    return parcelaSelecionada.valor - desconto;
  };

  const darBaixaPagamento = async () => {
    try {
      const token = localStorage.getItem('token'); // Obtém o token do LocalStorage
  
      if (!token) {
        alert('Token de autenticação não encontrado!');
        return;
      }
  
      const valorFinal = calcularValorComDesconto(); // Calcula o valor final com desconto
  
      const response = await axios.put(`http://localhost:3333/financeiro/baixa/${parcelaSelecionada.id}`, {
        metodoPagamento,
        desconto: descontoPercentual,
        valorPago: valorFinal,
      }, {
        headers: {
          Authorization: `Bearer ${token}`, // Inclui o token no cabeçalho da requisição
        },
      });
  
      setShowModal(false); // Fecha o modal
      // Atualiza os dados no estado do aluno
      setAluno((prevAluno: any) => ({
        ...prevAluno,
        financeiro: prevAluno.financeiro.map((parcela: any) => {
          if (parcela.id === parcelaSelecionada.id) {
            return {
              ...parcela,
              valorPago: response.data.valorPago, // Atualiza o valor pago
              dataPagamento: response.data.dataPagamento, // Atualiza a data de pagamento
              status: 'pago', // Atualiza o status
              desconto: descontoPercentual, // Atualiza o desconto
              multa, // Atualiza a multa se aplicável
              formaPagamento: metodoPagamento, // Atualiza a forma de pagamento
            };
          }
          return parcela;
        }),
      }));
  
      alert('Pagamento dado baixa com sucesso!');
    } catch (error) {
      console.error('Erro ao dar baixa no pagamento:', error);
      alert('Erro ao dar baixa no pagamento');
    }
  };

  const estornarPagamento = async (parcelaId: number) => {
    try {
      const token = localStorage.getItem('token'); // Obtém o token do LocalStorage
    
      if (!token) {
        alert('Token de autenticação não encontrado!');
        return;
      }
  
      // Faz o estorno do pagamento e obtém o valor restaurado
      const response = await axios.put(`http://localhost:3333/financeiro/estorno/${parcelaId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`, // Inclui o token no cabeçalho da requisição
        },
      });
  
      // Atualiza os dados do aluno no estado após o estorno
      setAluno((prevAluno: any) => ({
        ...prevAluno,
        financeiro: prevAluno.financeiro.map((parcela: any) => {
          if (parcela.id === parcelaId) {
            return {
              ...parcela,
              valor: response.data.valor, // Restaura o valor original da parcela
              valorPago: 0, // Zera o valor pago
              desconto: 0, // Zera o desconto
              status: 'pendente', // Atualiza o status para pendente
              dataPagamento: null, // Remove a data de pagamento
            };
          }
          return parcela;
        }),
      }));
  
      alert('Pagamento estornado com sucesso!');
    } catch (error) {
      console.error('Erro ao estornar pagamento:', error);
      alert('Erro ao estornar pagamento');
    }
  };
  

  if (loading) {
    return <p>Carregando dados do aluno...</p>;
  }

  if (!aluno) {
    return <p>Aluno não encontrado.</p>;
  }

  return (
    <div className="aluno-detalhes-container">
      <button className="voltar-button" onClick={handleVoltar}>← Voltar</button>
      <h1>Detalhes do Aluno</h1>
      <div className="tabs">
        <button
          className={activeTab === 'curso' ? 'active' : ''}
          onClick={() => setActiveTab('curso')}
        >
          Cursos
        </button>
        <button
          className={activeTab === 'financeiro' ? 'active' : ''}
          onClick={() => setActiveTab('financeiro')}
        >
          Financeiro
        </button>
        <button
          className={activeTab === 'cadastro' ? 'active' : ''}
          onClick={() => setActiveTab('cadastro')}
        >
          Cadastro
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'curso' && (
          <div>
            <h2>Curso</h2>
            {aluno.cursoMatriculado ? (
              <>
                <p><strong>Nome do Curso:</strong> {aluno.cursoMatriculado.nome}</p>
                <p><strong>Dias da Semana:</strong> {aluno.cursoMatriculado.diasDaSemana?.join(', ') || 'Nenhum dia cadastrado.'}</p>
                <p><strong>Horas por Dia:</strong> {aluno.cursoMatriculado.horasPorDia || 'Não especificado'}</p>
                <p><strong>Disciplinas:</strong> {aluno.cursoMatriculado.disciplinas?.join(', ') || 'Nenhuma disciplina cadastrada.'}</p>
              </>
            ) : (
              <p>Nenhum curso cadastrado.</p>
            )}
          </div>
        )}

        {activeTab === 'financeiro' && (
          <div>
            <h2>Financeiro</h2>
            {aluno.financeiro && aluno.financeiro.length > 0 ? (
              <table className="financeiro-table">
                <thead>
                  <tr>
                    <th>Vencimento</th>
                    <th>Valor</th>
                    <th>Desconto</th>
                    <th>Status</th>
                    <th>Data Pag.</th>
                    <th>Forma</th>
                    <th>Multa</th>
                    <th>Valor Pago</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {aluno.financeiro
                    .sort((a: any, b: any) => new Date(a.dataVencimento).getTime() - new Date(b.dataVencimento).getTime())
                    .map((parcela: any, index: number) => (
                    <tr key={index}>
                      <td>{new Date(parcela.dataVencimento).toLocaleDateString('pt-BR')}</td>
                      <td>R$ {parcela.valor.toFixed(2)}</td>
                      <td>{parcela.desconto || 0}%</td>
                      <td>{parcela.status}</td>
                      <td>{parcela.dataPagamento ? new Date(parcela.dataPagamento).toLocaleDateString('pt-BR') : '-'}</td>
                      <td>{parcela.formaPagamento || '-'}</td>
                      <td>R$ {parcela.multa?.toFixed(2) || '0,00'}</td>
                      <td>R$ {parcela.valorPago?.toFixed(2) || '0,00'}</td>
                      <td>
                        {parcela.status === 'pendente' ? (
                          <button className="dar-baixa-btn" onClick={() => abrirModalBaixa(parcela)}>Dar Baixa</button>
                        ) : (
                          <button className="estornar-btn" onClick={() => estornarPagamento(parcela.id)}>Estornar</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Nenhuma parcela cadastrada.</p>
            )}
          </div>
        )}

        {activeTab === 'cadastro' && (
          <div>
            <h2>Cadastro</h2>
            <p><strong>Nome:</strong> {aluno.nome}</p>
            <p><strong>CPF:</strong> {aluno.cpf}</p>
            <p><strong>Endereço:</strong> {aluno.endereco}</p>
            <p><strong>Telefone:</strong> {aluno.telefone}</p>
            <button onClick={() => {/* lógica para editar cadastro */}}>Editar Cadastro</button>
          </div>
        )}
      </div>

      {/* Modal para dar baixa */}
      {showModal && (
        <div className="modal-popup">
          <div className="popup-content">
            <h2>Pagamento de Parcela</h2>
            <p><strong>Data Vencimento:</strong> {new Date(parcelaSelecionada.dataVencimento).toLocaleDateString('pt-BR')}</p>
            <p><strong>Valor da Parcela:</strong> R$ {parcelaSelecionada.valor.toFixed(2)}</p>
            <p><strong>Multa:</strong> R$ {multa.toFixed(2)}</p>
            <label>
              <strong>Valor Pago:</strong>
              <input
                type="number"
                value={isNaN(valorPago) ? '' : valorPago}
                onChange={(e) => setValorPago(parseFloat(e.target.value))}
                min="0"
                max={parcelaSelecionada.valor}
              />
            </label>
            <label>
              <strong>Desconto (%):</strong>
              <input
                type="number"
                value={isNaN(descontoPercentual) ? '' : descontoPercentual}
                onChange={(e) => setDescontoPercentual(parseFloat(e.target.value))}
                min="0"
                max="100"
              />
            </label>
            <label>
              <strong>Método de Pagamento:</strong>
              <select value={metodoPagamento} onChange={(e) => setMetodoPagamento(e.target.value)}>
                <option value="pix">PIX</option>
                <option value="cartao">Cartão de Crédito</option>
                <option value="especie">Espécie</option>
                <option value="boleto">Boleto</option>
              </select>
            </label>
            <div className="modal-buttons">
              <button onClick={darBaixaPagamento}>Confirmar Pagamento</button>
              <button onClick={() => setShowModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RelatorioAlunoDetalhes;
