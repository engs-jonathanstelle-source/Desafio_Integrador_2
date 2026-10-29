import AsyncStorage from '@react-native-async-storage/async-storage';
import { USAR_API } from './config';
import { requisicao, definirToken } from './http';

const CHAVE_USUARIOS = '@usuarios';
const CHAVE_SESSAO = '@sessao';

// ---------- MODO LOCAL (sem backend) ----------
// ATENÇÃO: a senha fica em texto puro apenas neste modo de teste.
async function lerUsuarios() {
  return JSON.parse((await AsyncStorage.getItem(CHAVE_USUARIOS)) || '[]');
}

const localRegistrar = async ({ nomeUsuario, email, senha }) => {
  const usuarios = await lerUsuarios();
  if (usuarios.some((u) => u.email === email)) throw new Error('EMAIL_EXISTE');
  const novo = { id: Date.now(), nomeUsuario, email, senha };
  await AsyncStorage.setItem(CHAVE_USUARIOS, JSON.stringify([...usuarios, novo]));
  const { senha: _, ...usuario } = novo;
  return { token: null, usuario };
};

const localLogin = async ({ email, senha }) => {
  const usuarios = await lerUsuarios();
  const u = usuarios.find((x) => x.email === email && x.senha === senha);
  if (!u) throw new Error('CREDENCIAIS_INVALIDAS');
  const { senha: _, ...usuario } = u;
  return { token: null, usuario };
};

// ---------- MODO API SPRING BOOT ----------
// POST /auth/register  body: { nomeUsuario, email, senha }
//   -> 201 { token, usuario: { id, nomeUsuario, email } }   (409 se e-mail já existe)
// POST /auth/login     body: { email, senha }
//   -> 200 { token, usuario: { id, nomeUsuario, email } }   (401 se inválido)
const apiRegistrar = (dados) => requisicao('/auth/register', { method: 'POST', body: JSON.stringify(dados) });
const apiLogin = async (dados) => {
  try {
    return await requisicao('/auth/login', { method: 'POST', body: JSON.stringify(dados) });
  } catch (e) {
    if (e.message === 'NAO_AUTORIZADO') throw new Error('CREDENCIAIS_INVALIDAS');
    throw e;
  }
};

// ---------- Funções usadas pelo app ----------
export async function registrar(dados) {
  const r = USAR_API
    ? await apiRegistrar(dados).catch((e) => { throw e.message === 'CONFLITO' ? new Error('EMAIL_EXISTE') : e; })
    : await localRegistrar(dados);
  await salvarSessao(r);
  return r.usuario;
}

export async function entrar(dados) {
  const r = USAR_API ? await apiLogin(dados) : await localLogin(dados);
  await salvarSessao(r);
  return r.usuario;
}

export async function sair() {
  definirToken(null);
  await AsyncStorage.removeItem(CHAVE_SESSAO);
}

export async function carregarSessao() {
  const s = JSON.parse((await AsyncStorage.getItem(CHAVE_SESSAO)) || 'null');
  if (s?.token) definirToken(s.token);
  return s?.usuario ?? null;
}

async function salvarSessao({ token, usuario }) {
  definirToken(token);
  await AsyncStorage.setItem(CHAVE_SESSAO, JSON.stringify({ token, usuario }));
}
