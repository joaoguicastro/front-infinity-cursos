import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login/Login';
import DashboardMaster from './pages/DashboardMaster/DashboardMaster';
import CadastroAluno from './pages/CasdastroAluno/CadastroAluno';
import CriacaoCurso from './pages/CriacaoCurso/CriacaoCurso';
import CriacaoFinanceiro from './pages/CriacaoFinanceiro/CriacaoFinanceiro';
import CriacaoUsuario from './pages/CriacaoUsuario/CriacaoUsuario';
import RelatorioCursos from './pages/RelatorioCursos/RelatorioCursos';
import RelatorioAlunos from './pages/RelatorioAlunos/RelatorioAlunos';
import RelatorioDevedores from './pages/RelatorioDevedores/RelatorioDevedores';
import RelatorioAlunoDetalhes from './pages/relatorioalubosdetalhado/RelatorioAlunoDetalhes';
import AdminDashboard from './pages/DashboardAdmin/AdminDashboard';
import TelaPresenca from './pages/PresencaAluno/TelaPresenca';
import RelatorioPresenca from './pages/RelatorioPresenca/RelatorioPresenca';
import RelatorioUsuarios from './pages/RelatorioUsuario/RelatorioUsuarios';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard-master" element={<DashboardMaster />} />
        <Route path="/dashboard-admin" element={<AdminDashboard />} />
        <Route path="/cadastro-aluno" element={<CadastroAluno />} />
        <Route path="/cadastro-curso" element={<CriacaoCurso />} />
        <Route path="/cadastro-financeiro" element={<CriacaoFinanceiro />} />
        <Route path="/cadastro-usuario" element={<CriacaoUsuario />} />
        <Route path="/relatorio-cursos" element={<RelatorioCursos />} />
        <Route path="/relatorio-alunos" element={<RelatorioAlunos />} />
        <Route path="/alunos/:id" element={<RelatorioAlunoDetalhes />} />
        <Route path="/relatorio-devedores" element={<RelatorioDevedores />} />
        <Route path="/admin/home" element={<AdminDashboard />} />
        <Route path="/admin/cadastro-aluno" element={<CadastroAluno />} />
        <Route path="/admin/cadastro-curso" element={<CriacaoCurso />} />
        <Route path="/admin/cadastro-financeiro" element={<CriacaoFinanceiro />} />
        <Route path="/admin/relatorio-cursos" element={<RelatorioCursos />} />
        <Route path="/admin/relatorio-alunos" element={<RelatorioAlunos />} />
        <Route path="/admin/relatorio-devedores" element={<RelatorioDevedores />} />
        <Route path="/presenca" element={<TelaPresenca />} />
        <Route path="/relatorio-presenca" element={<RelatorioPresenca />} />
        <Route path="/relatorio-usuarios" element={<RelatorioUsuarios />} />
      </Routes>
    </Router>
  );
};

export default App;
