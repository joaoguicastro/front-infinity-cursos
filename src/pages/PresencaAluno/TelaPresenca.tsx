import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SidebarMenu from '../../components/Sidebarmenu';
import './TelaPresenca.css';

interface Curso {
  id: number;
  nome: string;
  alunos: { id: number; nome: string }[]; // Alunos vinculados ao curso
}

interface Aluno {
  id: number;
  nome: string;
}

const TelaPresenca: React.FC = () => {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [cursoSelecionado, setCursoSelecionado] = useState<number | null>(null);
  const [dataSelecionada, setDataSelecionada] = useState<string>('');
  const [alunoSelecionado, setAlunoSelecionado] = useState<Aluno | null>(null);

  // Fetch dos cursos
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
        alert('Erro ao carregar os cursos.');
      }
    };

    fetchCursos();
  }, []);

  // Fetch dos alunos de um curso
  const fetchAlunos = async (cursoId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3333/cursos/${cursoId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log('Curso com alunos:', response.data); // Para verificar se os alunos estão retornando corretamente
  
      const curso = response.data;
      if (curso.alunos) {
        setAlunos(curso.alunos);
      } else {
        setAlunos([]);
        alert('Nenhum aluno encontrado para este curso.');
      }
    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
      alert('Erro ao carregar os alunos deste curso.');
    }
  };
  

  const marcarPresenca = async (alunoId: number, cursoId: number, data: string, presente: boolean, observacao?: string) => {
    try {
      const token = localStorage.getItem('token');
  
      const response = await axios.post(
        'http://localhost:3333/presenca',
        {
          alunoId,
          cursoId,
          data, // Deve ser no formato "YYYY-MM-DD"
          presente,
          observacao,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      console.log('Presença registrada:', response.data);
    } catch (error) {
      console.error('Erro ao registrar presença:', error);
    }
  };

  const handleRegistrarPresenca = async (alunoId: number, cursoId: number) => {
    const dataAtual = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
    const presente = true; // Ajuste conforme necessário
  
    try {
      await marcarPresenca(alunoId, cursoId, dataAtual, presente, 'Aluno presente no dia.');
      alert('Presença registrada com sucesso!');
    } catch (error) {
      console.error('Erro ao registrar presença:', error);
      alert('Erro ao registrar presença. Tente novamente.');
    }
  };
  
  
  return (
    <div className="page-container">
      <SidebarMenu />
      <div className="content-container">
        <h1>Registrar Presença</h1>

        {/* Seleção do curso */}
        <div className="select-container">
          <label htmlFor="curso-select">Selecione um curso:</label>
          <select
            id="curso-select"
            value={cursoSelecionado || ''}
            onChange={(e) => {
              const cursoId = parseInt(e.target.value);
              setCursoSelecionado(cursoId);
              fetchAlunos(cursoId); // Carrega alunos do curso selecionado
            }}
          >
            <option value="" disabled>
              Escolha um curso
            </option>
            {cursos.map((curso) => (
              <option key={curso.id} value={curso.id}>
                {curso.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Lista de alunos */}
        {alunos.length > 0 && (
          <div className="alunos-list">
            {alunos.map((aluno) => (
              <div
                key={aluno.id}
                className={`aluno-item ${
                  alunoSelecionado?.id === aluno.id ? 'selected' : ''
                }`}
                onClick={() => setAlunoSelecionado(aluno)}
              >
                {aluno.nome}
              </div>
            ))}
          </div>
        )}

        {/* Formulário para registrar presença */}
        {alunoSelecionado && (
          <div className="calendario-container">
            <h2>Registrar presença para: {alunoSelecionado.nome}</h2>
            <input
              type="date"
              value={dataSelecionada}
              onChange={(e) => setDataSelecionada(e.target.value)}
            />
            <button
              onClick={() => {
                if (alunoSelecionado && cursoSelecionado && dataSelecionada) {
                  handleRegistrarPresenca(alunoSelecionado.id, cursoSelecionado);
                } else {
                  alert('Por favor, selecione um aluno, um curso e uma data.');
                }
              }}
            >
              Registrar Presença
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TelaPresenca;
