import { USAR_API } from './config';
import { requisicao } from './http';
import { LUGARES, IMAGENS_POR_ID } from '../data/lugares';

// Foto usada se a API devolver um lugar que o app ainda não tem imagem
const IMAGEM_PADRAO = require('../assets/images/locais/Quiosques.jpeg');

// GET /lugares -> [{ id, nome, descricao, agendavel }]
// As fotos continuam no app (data/lugares.js) e são ligadas a cada lugar pelo id.
export async function listarLugares() {
  if (!USAR_API) return LUGARES;
  const lista = await requisicao('/lugares');
  return lista.map((l) => ({ ...l, imagem: IMAGENS_POR_ID[l.id] || IMAGEM_PADRAO }));
}
