import { BASE_URL } from './config';

let token = null;
export const definirToken = (t) => { token = t; };

// Chamado quando a API recusa o token (sessão expirada): o AuthContext usa isso para
// voltar à tela de login.
let aoNaoAutorizado = null;
export const definirAoNaoAutorizado = (fn) => { aoNaoAutorizado = fn; };

const TEMPO_LIMITE_MS = 10000;

// Cliente HTTP usado por authService, lugares e agendamentos quando USAR_API = true.
export async function requisicao(caminho, opcoes = {}) {
  const controlador = new AbortController();
  const timer = setTimeout(() => controlador.abort(), TEMPO_LIMITE_MS);

  let resposta;
  try {
    resposta = await fetch(`${BASE_URL}${caminho}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      signal: controlador.signal,
      ...opcoes,
    });
  } catch (e) {
    // Sem rede, API desligada, endereço errado ou tempo esgotado
    throw new Error('SEM_CONEXAO');
  } finally {
    clearTimeout(timer);
  }

  if (resposta.status === 409) throw new Error('CONFLITO');
  if (resposta.status === 401) {
    if (token && aoNaoAutorizado) aoNaoAutorizado();
    throw new Error('NAO_AUTORIZADO');
  }
  if (!resposta.ok) throw new Error(`ERRO_API_${resposta.status}`);
  return resposta.status === 204 ? null : resposta.json();
}
