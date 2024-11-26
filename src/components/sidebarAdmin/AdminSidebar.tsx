import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminSidebar.css';

const AdminSidebar: React.FC = () => {
  const navigate = useNavigate();
  const [activeFolder, setActiveFolder] = useState<string | null>(null);

  const toggleFolder = (folderName: string) => {
    setActiveFolder(activeFolder === folderName ? null : folderName);
  };

  return (
    <div className="admin-sidebar">
      <h2 className="admin-sidebar-title">Admin Dashboard</h2>
      <ul className="admin-sidebar-menu">
        <li onClick={() => navigate('/admin/home')} className="admin-sidebar-item">Home</li>
        
        <li
          className={`admin-sidebar-item folder ${activeFolder === 'criar' ? 'active' : ''}`}
          onClick={() => toggleFolder('criar')}
        >
          Criar
          {activeFolder === 'criar' && (
            <ul className="folder-content">
              <li onClick={() => navigate('/admin/cadastro-aluno')} className="admin-sidebar-subitem">Criar Aluno</li>
              <li onClick={() => navigate('/presenca')}>Presença</li>
            </ul>
          )}
        </li>

        <li
          className={`admin-sidebar-item folder ${activeFolder === 'relatorios' ? 'active' : ''}`}
          onClick={() => toggleFolder('relatorios')}
        >
          Relatórios
          {activeFolder === 'relatorios' && (
            <ul className="folder-content">
              <li onClick={() => navigate('/admin/relatorio-alunos')} className="admin-sidebar-subitem">Relatório de Alunos</li>
              <li onClick={() => navigate('/admin/relatorio-devedores')} className="admin-sidebar-subitem">Relatório de Devedores</li>
              <li onClick={() => navigate('/relatorio-presenca')}>Relatorios Presença</li>
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
