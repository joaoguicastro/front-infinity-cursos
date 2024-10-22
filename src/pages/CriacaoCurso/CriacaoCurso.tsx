import React, { useState } from 'react';
import axios from 'axios';
import SidebarMenu from '../../components/Sidebarmenu'; // Importar o componente de menu
import './CriacaoCurso.css';

const CriacaoCurso: React.FC = () => {
  const [nomeCurso, setNomeCurso] = useState('');
  const [cargaHoraria, setCargaHoraria] = useState('');
  const [disciplinas, setDisciplinas] = useState<string[]>([]); // Estado para as disciplinas
  const [novaDisciplina, setNovaDisciplina] = useState(''); // Para capturar uma nova disciplina
  const [diasDaSemana, setDiasDaSemana] = useState<string[]>([]); // Estado para os dias da semana
  const [horasPorDia, setHorasPorDia] = useState<number>(0); // Estado para as horas por dia
  const [loading, setLoading] = useState(false); // Para controle de carregamento

  // Função para adicionar nova disciplina à lista
  const adicionarDisciplina = () => {
    if (novaDisciplina.trim()) {
      setDisciplinas([...disciplinas, novaDisciplina.trim()]);
      setNovaDisciplina('');
    }
  };

  // Função para remover uma disciplina da lista
  const removerDisciplina = (indice: number) => {
    const novasDisciplinas = disciplinas.filter((_, i) => i !== indice);
    setDisciplinas(novasDisciplinas);
  };

  // Função para atualizar os dias da semana selecionados
  const handleDiaDaSemanaChange = (dia: string) => {
    if (diasDaSemana.includes(dia)) {
      setDiasDaSemana(diasDaSemana.filter((d) => d !== dia));
    } else {
      setDiasDaSemana([...diasDaSemana, dia]);
    }
  };

  const handleCriacaoCurso = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Ativa o estado de carregamento
    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(
        'http://localhost:3333/cursos',
        {
          nome: nomeCurso,
          cargaHoraria: Number(cargaHoraria), // Converte para número
          disciplinas, // Envia a lista de disciplinas
          diasDaSemana, // Envia os dias da semana
          horasPorDia, // Envia as horas por dia
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Curso criado com sucesso:', response.data);
      alert('Curso criado com sucesso!');

      // Limpar os campos após o sucesso
      setNomeCurso('');
      setCargaHoraria('');
      setDisciplinas([]);
      setDiasDaSemana([]);
      setHorasPorDia(0);
    } catch (error: any) {
      if (error.response) {
        console.error('Erro resposta da API:', error.response.data);
      } else if (error.request) {
        console.error('Erro na solicitação:', error.request);
      } else {
        console.error('Erro geral:', error.message);
      }
      alert('Erro ao criar curso. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false); // Desativa o estado de carregamento
    }
  };

  return (
    <div className="page-container-curso">
      <SidebarMenu />
      <div className="form-container-curso">
        <div className="criacao-curso-box">
          <h1>Criação de Curso</h1>
          <form onSubmit={handleCriacaoCurso}>
            <div className="form-group-curso">
              <label>Nome do Curso:</label>
              <input
                type="text"
                value={nomeCurso}
                onChange={(e) => setNomeCurso(e.target.value)}
                placeholder="Digite o nome do curso"
                required
              />
            </div>
            <div className="form-group-curso">
              <label>Carga Horária:</label>
              <input
                type="number"
                value={cargaHoraria}
                onChange={(e) => setCargaHoraria(e.target.value)}
                placeholder="Digite a carga horária"
                required
              />
            </div>

            {/* Seção para adicionar disciplinas */}
            <div className="form-group-curso">
              <label>Disciplinas:</label>
              <ul>
                {disciplinas.map((disciplina, index) => (
                  <li key={index}>
                    {disciplina}
                    <button
                      type="button"
                      onClick={() => removerDisciplina(index)}
                    >
                      Remover
                    </button>
                  </li>
                ))}
              </ul>
              <input
                type="text"
                value={novaDisciplina}
                onChange={(e) => setNovaDisciplina(e.target.value)}
                placeholder="Adicionar nova disciplina"
              />
              <button type="button" onClick={adicionarDisciplina}>
                Adicionar Disciplina
              </button>
            </div>

            {/* Seção para adicionar os dias da semana */}
            <div className="form-group-curso">
              <label>Dias da Semana:</label>
              <div className="checkbox-group">
                {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'].map((dia) => (
                  <label key={dia}>
                    <input
                      type="checkbox"
                      checked={diasDaSemana.includes(dia)}
                      onChange={() => handleDiaDaSemanaChange(dia)}
                    />
                    {dia}
                  </label>
                ))}
              </div>
            </div>

            {/* Seção para adicionar horas por dia */}
            <div className="form-group-curso">
              <label>Horas por Dia:</label>
              <input
                type="number"
                value={horasPorDia}
                onChange={(e) => setHorasPorDia(Number(e.target.value))}
                placeholder="Digite as horas por dia"
                required
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? 'Criando...' : 'Criar Curso'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CriacaoCurso;
