import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SidebarMenu from '../../components/Sidebarmenu'; // Importar o componente de menu
import './CriacaoFinanceiro.css';

const CriacaoFinanceiro: React.FC = () => {
  const [alunoId, setAlunoId] = useState('');
  const [cursoSelecionado, setCursoSelecionado] = useState<number | null>(null);
  const [valor, setValor] = useState('');
  const [quantidadeParcelas, setQuantidadeParcelas] = useState<number>(1); // Novo campo para quantidade de parcelas
  const [status, setStatus] = useState('');
  const [dataPagamento, setDataPagamento] = useState('');
  const [cursos, setCursos] = useState([]); // Para armazenar os cursos vindos do back-end
  const [alunos, setAlunos] = useState([]); // Para armazenar os alunos vindos do back-end

  // Função para buscar cursos no back-end
  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3333/relatorios/cursos', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCursos(response.data); // Armazena os cursos no estado
      } catch (error) {
        console.error('Erro ao buscar cursos:', error);
      }
    };

    const fetchAlunos = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3333/relatorios/alunos', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAlunos(response.data); // Armazena os alunos no estado
      } catch (error) {
        console.error('Erro ao buscar alunos:', error);
      }
    };

    fetchCursos();
    fetchAlunos();
  }, []);

  // Função para lidar com o envio do formulário de criação de financeiro
  const handleCriacaoFinanceiro = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    // Verificando os dados antes de enviar
    const financeiroData = {
      alunoId: parseInt(alunoId),
      cursoId: cursoSelecionado!,
      valor: parseFloat(valor), // Certifica-se de que o valor seja um número
      quantidadeParcelas,
      status,
      dataPagamento: dataPagamento || null, // Envia null se a data de pagamento não estiver definida
    };

    console.log('Dados enviados ao servidor:', financeiroData);

    try {
      const response = await axios.post(
        'http://localhost:3333/financeiro',
        financeiroData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Financeiro criado com sucesso:', response.data);
      alert('Financeiro criado com sucesso!');
    } catch (error: any) {
      if (error.response) {
        console.error('Erro resposta da API:', error.response.data); // Exibe os detalhes do erro da API
      } else {
        console.error('Erro geral:', error.message);
      }
      alert('Erro ao criar financeiro. Verifique os dados e tente novamente.');
    }
  };

  return (
    <div className="page-container-financeiro">
      <SidebarMenu />
      <div className="form-container-financeiro">
        <div className="criacao-financeiro-box">
          <h1>Criação de Financeiro</h1>
          <form onSubmit={handleCriacaoFinanceiro}>
            <div className="form-group-financeiro">
              <label>Curso:</label>
              <select
                value={cursoSelecionado || ''}
                onChange={(e) => setCursoSelecionado(parseInt(e.target.value))} // Converte o valor para número
                required
              >
                <option value="">Selecione um curso</option>
                {cursos.map((curso: any) => (
                  <option key={curso.id} value={curso.id}>
                    {curso.nome}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group-financeiro">
              <label>Valor:</label>
              <input
                type="number"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="Digite o valor"
                required
              />
            </div>
            <div className="form-group-financeiro">
              <label>Quantidade de Parcelas:</label>
              <input
                type="number"
                value={quantidadeParcelas}
                onChange={(e) => setQuantidadeParcelas(Number(e.target.value))}
                placeholder="Digite a quantidade de parcelas"
                required
              />
            </div>
            <div className="form-group-financeiro">
              <label>Status:</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
              >
                <option value="">Selecione o status</option>
                <option value="pendente">Pendente</option>
                <option value="pago">Pago</option>
              </select>
            </div>
            <div className="form-group-financeiro">
              <label>Data de Pagamento:</label>
              <input
                type="date"
                value={dataPagamento}
                onChange={(e) => setDataPagamento(e.target.value)}
              />
            </div>
            <button type="submit">Criar Financeiro</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CriacaoFinanceiro;
