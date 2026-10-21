// Comunicação com a API de agendamentos.
// Ajuste BASE_URL e os endpoints conforme a sua API.
// No Android Emulator, localhost do computador é http://10.0.2.2:PORTA
const BASE_URL = 'https://sua-api.com/api';

async function requisicao(caminho, opcoes = {}) {
  const resposta = await fetch(`${BASE_URL}${caminho}`, {
    headers: {
      'Content-Type': 'application/json',
      // Authorization: `Bearer ${token}`, // se sua API exigir login
    },
    ...opcoes,
  });

  // 409 = o horário já foi agendado por outra pessoa
  if (resposta.status === 409) {
    throw new Error('CONFLITO');
  }
  if (!resposta.ok) {
    throw new Error(`ERRO_API_${resposta.status}`);
  }
  return resposta.status === 204 ? null : resposta.json();
}

// GET /agendamentos?lugarId=1
// Deve retornar: [{ id, lugarId, data: 'AAAA-MM-DD', hora: 'HH:MM', nome, ... }]
export function listarPorLugar(lugarId) {
  return requisicao(`/agendamentos?lugarId=${encodeURIComponent(lugarId)}`);
}

// POST /agendamentos
// Deve retornar 201 com o agendamento criado, ou 409 se lugarId + data + hora já existir.
export function criarAgendamento(agendamento) {
  return requisicao('/agendamentos', {
    method: 'POST',
    body: JSON.stringify(agendamento),
  });
}