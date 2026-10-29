import { BASE_URL } from './config';

let token = null;
export const definirToken = (t) => { token = t; };

// Cliente HTTP usado por authService e agendamentos quando USAR_API = true.
export async function requisicao(caminho, opcoes = {}) {
  const resposta = await fetch(`${BASE_URL}${caminho}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...opcoes,
  });
  if (resposta.status === 409) throw new Error('CONFLITO');
  if (resposta.status === 401) throw new Error('NAO_AUTORIZADO');
  if (!resposta.ok) throw new Error(`ERRO_API_${resposta.status}`);
  return resposta.status === 204 ? null : resposta.json();
}
