import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SidebarMenu from '../../components/Sidebarmenu';
import './CriacaoFinanceiro.css';

const CriacaoFinanceiro: React.FC = () => {
  const [alunoId, setAlunoId] = useState('');
  const [cursoSelecionado, setCursoSelecionado] = useState<number | null>(null);
  const [valor, setValor] = useState('');
  const [quantidadeParcelas, setQuantidadeParcelas] = useState<number>(1);
  const [status, setStatus] = useState('');
  const [dataPagamento, setDataPagamento] = useState('');
  const [cursos, setCursos] = useState([]);
  const [alunos, setAlunos] = useState([]);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3333/relatorios/cursos', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCursos(response.data);
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
        setAlunos(response.data);
      } catch (error) {
        console.error('Erro ao buscar alunos:', error);
      }
    };

    fetchCursos();
    fetchAlunos();
  }, []);

  const formatarData = (data: string) => {
    const partes = data.split('-'); // Divide "aaaa-mm-dd"
    return `${partes[2]}/${partes[1]}/${partes[0]}`; // Retorna "dd/mm/aaaa"
  };

  const handleCriacaoFinanceiro = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const financeiroData = {
      alunoId: parseInt(alunoId),
      cursoId: cursoSelecionado!,
      valor: parseFloat(valor),
      quantidadeParcelas,
      status,
      dataVencimento: dataPagamento ? formatarData(dataPagamento) : undefined, // Converte para "dd/mm/aaaa"
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
        console.error('Erro resposta da API:', error.response.data);
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
                onChange={(e) => setCursoSelecionado(parseInt(e.target.value))}
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
                <option value="devendo">Devendo</option>
              </select>
            </div>
            <div className="form-group-financeiro">
              <label>Data de Vencimento:</label>
              <input
                type="date"
                value={dataPagamento}
                onChange={(e) => setDataPagamento(e.target.value)}
                required
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
