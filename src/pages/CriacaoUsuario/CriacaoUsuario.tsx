import React, { useState } from 'react';
import axios from 'axios';
import SidebarMenu from '../../components/Sidebarmenu'; // Importar o componente de menu
import './CriacaoUsuario.css';

const CriacaoUsuario: React.FC = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [cargo, setCargo] = useState('');
  const [loading, setLoading] = useState(false); // Adicionando estado para o carregamento

  const handleCriacaoUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Mostra o indicador de carregamento
    const token = localStorage.getItem('token');

    const usuarioData = {
      nome,
      email,
      senha,
      cargo,
    };

    console.log("Dados a serem enviados:", usuarioData);

    try {
      const response = await axios.post(
        'http://localhost:3333/usuarios',  // Verifique se a rota está correta no back-end
        usuarioData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Usuário criado com sucesso:', response.data);
      alert('Usuário criado com sucesso!');

      // Limpar os campos após a criação
      setNome('');
      setEmail('');
      setSenha('');
      setCargo('');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Erro ao criar usuário:', error.response ? error.response.data : error.message);
        alert('Erro ao criar usuário. Verifique os dados e tente novamente.');
      } else {
        console.error('Erro inesperado:', error);
        alert('Erro inesperado ao criar usuário. Verifique os dados e tente novamente.');
      }
    } finally {
      setLoading(false); // Remove o indicador de carregamento
    }
  };

  return (
    <div className="page-container-usuario">
      <SidebarMenu />
      <div className="form-container-usuario">
        <div className="criacao-usuario-box">
          <h1>Criação de Usuário</h1>
          <form onSubmit={handleCriacaoUsuario}>
            <div className="form-group-usuario">
              <label>Nome:</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Digite o nome do usuário"
                required
              />
            </div>
            <div className="form-group-usuario">
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite o email do usuário"
                required
              />
            </div>
            <div className="form-group-usuario">
              <label>Senha:</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Digite a senha"
                required
              />
            </div>
            <div className="form-group-usuario">
              <label>Cargo:</label>
              <select value={cargo} onChange={(e) => setCargo(e.target.value)} required>
                <option value="">Selecione o cargo</option>
                <option value="master">Master</option>
                <option value="admin">Admin</option>
                <option value="operador">Operador</option>
                <option value="professor">Professor</option>
              </select>
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Criando...' : 'Criar Usuário'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CriacaoUsuario;
