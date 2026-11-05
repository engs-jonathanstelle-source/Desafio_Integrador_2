import React, { createContext, useContext, useEffect, useState } from 'react';
import * as auth from '../services/authService';
import { definirAoNaoAutorizado } from '../services/http';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    auth.carregarSessao().then(setUsuario).finally(() => setCarregando(false));
    // Sessão expirada (a API recusou o token): volta para a tela de login
    definirAoNaoAutorizado(() => { auth.sair().finally(() => setUsuario(null)); });
  }, []);

  const value = {
    usuario,
    carregando,
    entrar: async (d) => setUsuario(await auth.entrar(d)),
    registrar: async (d) => setUsuario(await auth.registrar(d)),
    sair: async () => { await auth.sair(); setUsuario(null); },
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
