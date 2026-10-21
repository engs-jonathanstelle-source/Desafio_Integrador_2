import { cores } from './cores';

// Tipos de ponto: definem a cor da borda no mapa e a legenda
export const tiposPonto = {
    espaco: { rotulo: 'Quadras e pavilhão', cor: cores.primaria },
    acessibilidade: { rotulo: 'Acessibilidade', cor: cores.azul },
    lazer: { rotulo: 'Lazer', cor: cores.alerta },
};

// Pontos do parque. x e y são a posição no mapa, em % (dados fictícios;
// substituir pelos dados do diagnóstico da Engenharia Civil)
export const pontos = [
    { id: 'q1', nome: 'Quadra de Futsal', icone: '⚽', tipo: 'espaco', reservavel: true, x: 28, y: 30 },
    { id: 'q2', nome: 'Quadra de Vôlei', icone: '🏐', tipo: 'espaco', reservavel: true, x: 72, y: 28 },
    { id: 'q3', nome: 'Quadra de Basquete', icone: '🏀', tipo: 'espaco', reservavel: true, x: 52, y: 62 },
    { id: 'p1', nome: 'Pavilhão Comunitário', icone: '🏛', tipo: 'espaco', reservavel: true, x: 20, y: 68 },
    { id: 'a1', nome: 'Rampa de acesso', icone: '♿', tipo: 'acessibilidade', reservavel: false, x: 40, y: 88 },
    { id: 'a2', nome: 'Banheiro adaptado', icone: '🚻', tipo: 'acessibilidade', reservavel: false, x: 80, y: 60 },
    { id: 'a3', nome: 'Estacionamento acessível', icone: '🅿', tipo: 'acessibilidade', reservavel: false, x: 85, y: 86 },
    { id: 'l1', nome: 'Playground', icone: '🎠', tipo: 'lazer', reservavel: false, x: 12, y: 12 },
    { id: 'l2', nome: 'Trilha do Bosque', icone: '🥾', tipo: 'lazer', reservavel: false, x: 50, y: 12 },
];

// Horários disponíveis para agendamento (1 hora cada)
export const horarios = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00',
];