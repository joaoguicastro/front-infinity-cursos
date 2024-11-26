import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SidebarMenu from '../../components/Sidebarmenu'; // Componente de Sidebar
import './RelatorioUsuarios.css';

interface Usuario {
  id: number;
  nome: string;
  email: string;
  cargo: string;
}

const RelatorioUsuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [senhaVerificada, setSenhaVerificada] = useState<Record<number, boolean | null>>({});
  const [senha, setSenha] = useState<Record<number, string>>({});

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3333/usuarios', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsuarios(response.data);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        alert('Erro ao carregar os usuários.');
      }
    };

    fetchUsuarios();
  }, []);

  const verificarSenha = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:3333/usuarios/verificar-senha',
        { id, senha: senha[id] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSenhaVerificada((prev) => ({ ...prev, [id]: response.data.valid }));
    } catch (error) {
      console.error('Erro ao verificar senha:', error);
      alert('Erro ao verificar senha.');
      setSenhaVerificada((prev) => ({ ...prev, [id]: false }));
    }
  };

  const deletarUsuario = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja deletar este usuário?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3333/usuarios/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsuarios((prev) => prev.filter((usuario) => usuario.id !== id));
      alert('Usuário deletado com sucesso.');
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      alert('Erro ao deletar o usuário.');
    }
  };

  return (
    <div className="page-container-usuarios">
      <SidebarMenu />
      <div className="content-container">
        <h1>Relatório de Usuários</h1>
        <div className="usuarios-list">
          {usuarios.map((usuario) => (
            <div key={usuario.id} className="usuario-item">
              <p><strong>Nome:</strong> {usuario.nome}</p>
              <p><strong>Email:</strong> {usuario.email}</p>
              <p><strong>Cargo:</strong> {usuario.cargo}</p>

              <div className="senha-verificar">
                <input
                  type="password"
                  placeholder="Digite a senha"
                  value={senha[usuario.id] || ''}
                  onChange={(e) => setSenha((prev) => ({ ...prev, [usuario.id]: e.target.value }))}
                />
                <button onClick={() => verificarSenha(usuario.id)}>Verificar Senha</button>
              </div>

              {senhaVerificada[usuario.id] !== undefined && (
                <p>
                  {senhaVerificada[usuario.id]
                    ? 'Senha válida!'
                    : 'Senha inválida ou não verificada.'}
                </p>
              )}

              <button className="delete-button" onClick={() => deletarUsuario(usuario.id)}>
                Deletar Usuário
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RelatorioUsuarios;
