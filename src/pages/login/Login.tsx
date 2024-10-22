import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Certifique-se de que este arquivo CSS está no mesmo diretório ou ajuste o caminho

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação simples
    if (!email || !senha) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3333/login', {
        email,
        senha,
      });

      const { token, cargo } = response.data;

      if (token) {
        localStorage.setItem('token', token);

        // Redireciona o usuário para o dashboard correspondente
        switch (cargo) {
          case 'master':
            navigate('/dashboard-master');
            break;
          case 'admin':
            navigate('/dashboard-admin');
            break;
          case 'professor':
            navigate('/dashboard-professor');
            break;
          case 'operador':
            navigate('/dashboard-operador');
            break;
          default:
            setError('Cargo não reconhecido.');
            break;
        }
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setError('Falha no login, por favor verifique suas credenciais.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img src="/public/Ícone-do-logotipo-normal.png" alt="Logo" className="logo" />
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>} {/* Mensagem de erro */}
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="input-field"
          />
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
