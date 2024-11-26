import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SidebarMenu from '../../components/Sidebarmenu'; // Importar o componente de menu
import './RelatorioCursos.css'; // Importar o CSS para estilização

interface Curso {
  id: number;
  nome: string;
  disciplinas: string[]; // Disciplinas é um array de strings
  alunos: { id: number; nome: string }[]; // Alunos é um array de objetos
}

const RelatorioCursos: React.FC = () => {
  const [cursos, setCursos] = useState<Curso[]>([]);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3333/relatorios/cursos', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const cursosData = response.data || [];
        setCursos(cursosData);
      } catch (error) {
        console.error('Erro ao buscar cursos:', error);
        alert('Erro ao buscar cursos.');
      }
    };

    fetchCursos();
  }, []);

  return (
    <div className="page-container-relatorio">
      <SidebarMenu />
      <div className="relatorio-container">
        <h1>Relatório de Cursos</h1>
        <div className="scrollable-content">
          {cursos.length === 0 ? (
            <p>Não há cursos cadastrados no momento.</p>
          ) : (
            cursos.map((curso) => (
              <div key={curso.id} className="curso-box">
                <h2>Curso: {curso.nome}</h2>
                <h3>Disciplinas:</h3>
                <ul>
                  {curso.disciplinas && curso.disciplinas.length > 0 ? (
                    curso.disciplinas.map((disciplina, index) => (
                      <li key={index}>{disciplina}</li>
                    ))
                  ) : (
                    <li>Nenhuma disciplina cadastrada.</li>
                  )}
                </ul>
                <h3>Alunos Cadastrados:</h3>
                {curso.alunos && curso.alunos.length > 0 ? (
                  <ul>
                    {curso.alunos.map((aluno) => (
                      <li key={aluno.id}>{aluno.nome}</li>
                    ))}
                  </ul>
                ) : (
                  <p>Não há alunos cadastrados neste curso.</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RelatorioCursos;
