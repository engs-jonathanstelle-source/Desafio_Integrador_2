import AsyncStorage from '@react-native-async-storage/async-storage';
import { USAR_API } from './config';
import { requisicao } from './http';

const CHAVE = '@agendamentos';

// ---------- MODO LOCAL ----------
const lerTodos = async () => JSON.parse((await AsyncStorage.getItem(CHAVE)) || '[]');

const localListar = async (lugarId) => (await lerTodos()).filter((a) => a.lugarId === lugarId);

const localCriar = async (ag) => {
  const todos = await lerTodos();
  if (todos.some((a) => a.lugarId === ag.lugarId && a.data === ag.data && a.hora === ag.hora)) {
    throw new Error('CONFLITO');
  }
  const novo = { ...ag, id: Date.now() };
  await AsyncStorage.setItem(CHAVE, JSON.stringify([...todos, novo]));
  return novo;
};

// ---------- MODO API SPRING BOOT ----------
// GET  /agendamentos?lugarId=1
//   -> [{ id, lugarId, lugarNome, data:'AAAA-MM-DD', hora:'HH:MM', usuarioId, nomeUsuario, email }]
// POST /agendamentos  body: { lugarId, lugarNome, data, hora, usuarioId, nomeUsuario, email }
//   -> 201 com o agendamento, ou 409 se lugarId + data + hora já existir.
//   (No Spring, o usuário também pode vir do token JWT em vez do body.)
const apiListar = (lugarId) => requisicao(`/agendamentos?lugarId=${encodeURIComponent(lugarId)}`);
const apiCriar = (ag) => requisicao('/agendamentos', { method: 'POST', body: JSON.stringify(ag) });

export const listarPorLugar = (lugarId) => (USAR_API ? apiListar(lugarId) : localListar(lugarId));
export const criarAgendamento = (ag) => (USAR_API ? apiCriar(ag) : localCriar(ag));
