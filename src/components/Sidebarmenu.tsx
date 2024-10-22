import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SidebarMenu.css'; // Importar o CSS para estilização

const SidebarMenu: React.FC = () => {
  const navigate = useNavigate();

  // Estado para gerenciar qual pasta está ativa
  const [activeFolder, setActiveFolder] = useState<string | null>(null);

  const toggleFolder = (folderName: string) => {
    setActiveFolder(activeFolder === folderName ? null : folderName);
  };

  return (
    <div className="sidebar">
      <h3>Funcionalidades</h3>
      <ul>
        <li onClick={() => navigate('/dashboard-master')}>Menu</li> {/* Direcionando para o Dashboard Master */}

        <li className={`folder ${activeFolder === 'criar' ? 'active' : ''}`} onClick={() => toggleFolder('criar')}>
          Criar
          {activeFolder === 'criar' && (
            <ul className="folder-content">
              <li onClick={() => navigate('/cadastro-aluno')}>Criar Aluno</li>
              <li onClick={() => navigate('/cadastro-curso')}>Criar Curso</li>
              <li onClick={() => navigate('/cadastro-financeiro')}>Criar Financeiro</li>
              <li onClick={() => navigate('/cadastro-usuario')}>Criar Usuário</li>
            </ul>
          )}
        </li>

        <li className={`folder ${activeFolder === 'relatorios' ? 'active' : ''}`} onClick={() => toggleFolder('relatorios')}>
          Relatórios
          {activeFolder === 'relatorios' && (
            <ul className="folder-content">
              <li onClick={() => navigate('/relatorio-cursos')}>Relatório de Cursos</li>
              <li onClick={() => navigate('/relatorio-alunos')}>Relatório de Alunos</li>
              <li onClick={() => navigate('/relatorio-devedores')}>Relatório de Devedores</li>
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
};

export default SidebarMenu;
