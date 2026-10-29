import React, { createContext, useContext, useEffect, useState } from 'react';
import * as auth from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    auth.carregarSessao().then(setUsuario).finally(() => setCarregando(false));
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
