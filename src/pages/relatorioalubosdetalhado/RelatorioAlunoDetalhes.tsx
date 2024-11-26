import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RelatorioAlunoDetalhes.css';

const RelatorioAlunoDetalhes: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [aluno, setAluno] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('curso');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [senhaUsuario, setSenhaUsuario] = useState('');
  const [parcelaSelecionada, setParcelaSelecionada] = useState<any>(null);
  const [metodoPagamento, setMetodoPagamento] = useState('pix');
  const [descontoPercentual, setDescontoPercentual] = useState(0);
  const [valorPago, setValorPago] = useState(0);
  const [multa, setMulta] = useState(0);

  // Estados para edição do cadastro
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [nomeResponsavel, setNomeResponsavel] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [endereco, setEndereco] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cursoId, setCursoId] = useState<number>(0); // Curso selecionado
  const [cursos, setCursos] = useState<any[]>([]); // Lista de cursos disponíveis

  const fetchAluno = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3333/alunos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAluno(response.data);
      setLoading(false);

      // Preencher os campos de edição com os dados atuais do aluno
      setNome(response.data.nome);
      setCpf(response.data.cpf);
      setNomeResponsavel(response.data.nomeResponsavel);
      setDataNascimento(new Date(response.data.dataNascimento).toLocaleDateString('pt-BR'));
      setEndereco(response.data.endereco);
      setTelefone(response.data.telefone);
      setCursoId(response.data.cursoId); // Preencher com o curso do aluno
    } catch (error) {
      console.error('Erro ao buscar detalhes do aluno:', error);
      setLoading(false);
    }
  };

  const fetchCursos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3333/relatorios/cursos', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCursos(response.data); // Atualiza a lista de cursos disponíveis
    } catch (error) {
      console.error('Erro ao buscar cursos:', error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchAluno();
    }
    fetchCursos(); // Busca a lista de cursos quando o componente é montado
  }, [id]);

  const handleVoltar = () => {
    navigate('/relatorio-alunos');
  };

  const abrirModalBaixa = (parcela: any) => {
    setParcelaSelecionada(parcela);
    setShowModal(true);
    setValorPago(parcela.valor);
    setMulta(0);
  };

  const calcularValorComDesconto = () => {
    const desconto = (parcelaSelecionada.valor * descontoPercentual) / 100;
    return parcelaSelecionada.valor - desconto;
  };

  const darBaixaPagamento = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Token de autenticação não encontrado!');
        return;
      }
      const valorFinal = calcularValorComDesconto();
      await axios.put(
        `http://localhost:3333/financeiro/baixa/${parcelaSelecionada.id}`,
        {
          metodoPagamento,
          desconto: descontoPercentual,
          valorPago: valorFinal,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShowModal(false);
      fetchAluno();
      alert('Pagamento dado baixa com sucesso!');
    } catch (error) {
      console.error('Erro ao dar baixa no pagamento:', error);
      alert('Erro ao dar baixa no pagamento');
    }
  };

  const estornarPagamento = async (parcelaId: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Token de autenticação não encontrado!');
        return;
      }
      await axios.put(`http://localhost:3333/financeiro/estorno/${parcelaId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchAluno();
      alert('Pagamento estornado com sucesso!');
    } catch (error) {
      console.error('Erro ao estornar pagamento:', error);
      alert('Erro ao estornar pagamento');
    }
  };

  const handleDeletarAluno = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!senhaUsuario) {
        alert('Por favor, insira sua senha para confirmar.');
        return;
      }
      await axios.delete(`http://localhost:3333/alunos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          senha: senhaUsuario,
        },
      });
      alert('Aluno deletado com sucesso!');
      navigate('/relatorio-alunos');
    } catch (error) {
      console.error('Erro ao deletar aluno:', error);
      alert('Erro ao deletar aluno. Verifique a senha e tente novamente.');
    }
  };

  const handleSalvarEdicao = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Token de autenticação não encontrado!');
        return;
      }
      await axios.put(
        `http://localhost:3333/alunos/${id}`,
        { nome, cpf, nomeResponsavel, dataNascimento, endereco, telefone, cursoId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Dados do aluno atualizados com sucesso!');
      setShowModalEdit(false);
      fetchAluno();
    } catch (error) {
      console.error('Erro ao atualizar dados do aluno:', error);
      alert('Erro ao atualizar dados do aluno.');
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
            {aluno.cursoMatriculado?.financeiro && aluno.cursoMatriculado.financeiro.length > 0 ? (
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
                  {aluno.cursoMatriculado.financeiro.map((parcela: any, index: number) => (
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
            <p><strong>Curso:</strong> {aluno.cursoMatriculado?.nome}</p>
            <button onClick={() => setShowModalEdit(true)}>Editar Cadastro</button>
            <button onClick={() => setShowModalDelete(true)}>Deletar Aluno</button>
          </div>
        )}
      </div>

      {showModalEdit && (
        <div className="modal-popup">
          <div className="popup-content">
            <h2>Editar Dados do Aluno</h2>
            <label>
              Nome:
              <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />
            </label>
            <label>
              CPF:
              <input type="text" value={cpf} onChange={(e) => setCpf(e.target.value)} />
            </label>
            <label>
              Nome do Responsável:
              <input type="text" value={nomeResponsavel} onChange={(e) => setNomeResponsavel(e.target.value)} />
            </label>
            <label>
              Data de Nascimento:
              <input
                type="date"
                value={dataNascimento}
                onChange={(e) => setDataNascimento(e.target.value)}
              />
            </label>
            <label>
              Endereço:
              <input type="text" value={endereco} onChange={(e) => setEndereco(e.target.value)} />
            </label>
            <label>
              Telefone:
              <input type="text" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
            </label>
            <label>
              Curso:
              <select
                value={cursoId}
                onChange={(e) => setCursoId(Number(e.target.value))}
              >
                {cursos.map((curso) => (
                  <option key={curso.id} value={curso.id}>
                    {curso.nome}
                  </option>
                ))}
              </select>
            </label>
            <div className="modal-buttons">
              <button onClick={handleSalvarEdicao}>Salvar</button>
              <button onClick={() => setShowModalEdit(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {showModalDelete && (
        <div className="modal-popup">
          <div className="popup-content">
            <h2>Confirmação de Exclusão</h2>
            <p>Para deletar o aluno, insira sua senha de usuário:</p>
            <input
              type="password"
              placeholder="Digite sua senha"
              value={senhaUsuario}
              onChange={(e) => setSenhaUsuario(e.target.value)}
            />
            <div className="modal-buttons">
              <button onClick={handleDeletarAluno}>Confirmar Exclusão</button>
              <button onClick={() => setShowModalDelete(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

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
