import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE = '@parquevivo:reservas';

// Retorna todas as reservas salvas no aparelho
export async function listarReservas() {
    try {
        const json = await AsyncStorage.getItem(CHAVE);
        return json ? JSON.parse(json) : [];
    } catch (erro) {
        console.warn('Erro ao ler reservas:', erro);
        return [];
    }
}

// Retorna os horários já ocupados de um espaço em uma data (AAAA-MM-DD)
export async function listarHorariosOcupados(espacoId, data) {
    const reservas = await listarReservas();
    return reservas
        .filter((r) => r.espacoId === espacoId && r.data === data)
        .map((r) => r.hora);
}

// Salva uma reserva. Retorna false se o horário já estiver ocupado
export async function salvarReserva(reserva) {
    try {
        const atuais = await listarReservas();
        const existe = atuais.some(
            (r) =>
                r.espacoId === reserva.espacoId &&
                r.data === reserva.data &&
                r.hora === reserva.hora
        );
        if (existe) return false;

        // Sempre grava um novo array, sem alterar o anterior
        await AsyncStorage.setItem(CHAVE, JSON.stringify([...atuais, reserva]));
        return true;
    } catch (erro) {
        console.warn('Erro ao salvar reserva:', erro);
        return false;
    }
}