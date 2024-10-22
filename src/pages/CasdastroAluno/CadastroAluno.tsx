import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios'; // Importar AxiosError para tratamento de erro
import SidebarMenu from '../../components/Sidebarmenu';
import './CadastroAluno.css';

const CadastroAluno: React.FC = () => {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [nomeResponsavel, setNomeResponsavel] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [endereco, setEndereco] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cursos, setCursos] = useState<any[]>([]); // Tipagem dos cursos
  const [cursoSelecionado, setCursoSelecionado] = useState('');
  const [loading, setLoading] = useState(false); // Controle de carregamento

  // Função para buscar os cursos no banco
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

    fetchCursos();
  }, []);

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Inicia o estado de carregamento

    const token = localStorage.getItem('token');
  
    const alunoData = {
      nome,
      cpf,
      nomeResponsavel,
      dataNascimento,
      endereco,
      telefone, 
      cursoId: Number(cursoSelecionado), 
    };
  
    console.log('Dados enviados ao servidor:', alunoData);
  
    try {
      const response = await axios.post(
        'http://localhost:3333/alunos',
        alunoData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log('Aluno cadastrado com sucesso:', response.data);
      alert('Aluno cadastrado com sucesso!');
      
      // Limpar os campos após o sucesso
      setNome('');
      setCpf('');
      setNomeResponsavel('');
      setDataNascimento('');
      setEndereco('');
      setTelefone('');
      setCursoSelecionado('');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Erro na resposta do servidor:', error.response?.data);
        alert('Erro ao cadastrar aluno. Verifique os dados e tente novamente.');
      } else {
        console.error('Erro inesperado:', error);
        alert('Erro inesperado ao cadastrar aluno.');
      }
    } finally {
      setLoading(false); // Finaliza o estado de carregamento
    }
  };

  return (
    <div className="page-container-aluno">
      <SidebarMenu />
      <div className="form-container-custom">
        <div className="cadastro-aluno-box">
          <h1>Cadastro de Aluno</h1>
          <form onSubmit={handleCadastro}>
            <div className="form-group-custom">
              <label>Nome:</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Digite o nome do aluno"
                required
              />
            </div>
            <div className="form-group-custom">
              <label>CPF:</label>
              <input
                type="text"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                placeholder="Digite o CPF do aluno"
                required
              />
            </div>
            <div className="form-group-custom">
              <label>Nome do Responsável:</label>
              <input
                type="text"
                value={nomeResponsavel}
                onChange={(e) => setNomeResponsavel(e.target.value)}
                placeholder="Digite o nome do responsável"
                required
              />
            </div>
            <div className="form-group-custom">
              <label>Data de Nascimento:</label>
              <input
                type="date"
                value={dataNascimento}
                onChange={(e) => setDataNascimento(e.target.value)}
                required
              />
            </div>
            <div className="form-group-custom">
              <label>Endereço:</label>
              <input
                type="text"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                placeholder="Digite o endereço"
                required
              />
            </div>
            <div className="form-group-custom">
              <label>Telefone:</label>
              <input
                type="text"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="Digite o telefone"
                required
              />
            </div>
            <div className="form-group-custom">
              <label>Curso:</label>
              <select
                value={cursoSelecionado}
                onChange={(e) => setCursoSelecionado(e.target.value)}
                required
              >
                <option value="">Selecione um curso</option>
                {cursos.map((curso) => (
                  <option key={curso.id} value={curso.id}>
                    {curso.nome}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Cadastrando...' : 'Cadastrar Aluno'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CadastroAluno;
