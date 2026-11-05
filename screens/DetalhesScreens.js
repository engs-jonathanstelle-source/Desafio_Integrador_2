import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { horarios } from '../services/espacos';
import { listarHorariosOcupados, salvarReserva } from '../services/reservas';
import { cores } from '../services/cores';

// Gera os próximos dias para escolha (chave no formato AAAA-MM-DD)
function gerarDias(qtd) {
    return Array.from({ length: qtd }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        return {
            chave: `${d.getFullYear()}-${mm}-${dd}`,
            rotulo: i === 0 ? 'Hoje' : i === 1 ? 'Amanhã' : `${dd}/${mm}`,
            hoje: i === 0,
        };
    });
}

export default function DetalhesScreens({ navigation, route }) {
    // Espaço recebido da tela anterior
    const { espaco } = route.params;

    const [dias] = useState(() => gerarDias(4));
    const [dia, setDia] = useState(dias[0]);
    const [hora, setHora] = useState(null);
    const [ocupados, setOcupados] = useState([]);

    useLayoutEffect(() => {
        navigation.setOptions({ title: espaco.nome });
    }, [navigation, espaco]);

    // Recarrega os horários ocupados sempre que o dia muda
    useEffect(() => {
        carregarOcupados();
        setHora(null);
    }, [dia]);

    const carregarOcupados = async () => {
        setOcupados(await listarHorariosOcupados(espaco.id, dia.chave));
    };

    // Horário já passado (só vale para o dia de hoje)
    const jaPassou = (h) => dia.hoje && parseInt(h, 10) <= new Date().getHours();

    const confirmar = async () => {
        const salvou = await salvarReserva({
            id: Date.now().toString(),
            espacoId: espaco.id,
            espacoNome: espaco.nome,
            data: dia.chave,
            hora,
        });

        if (salvou) {
            Alert.alert('Reserva confirmada', `${espaco.nome}\n${dia.rotulo} às ${hora}`, [
                { text: 'OK', onPress: () => navigation.navigate('Lista') },
            ]);
        } else {
            Alert.alert('Horário indisponível', 'Alguém acabou de reservar este horário.');
            carregarOcupados();
            setHora(null);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={{ padding: 16 }}>
                <View style={styles.cabecalho}>
                    <Text style={styles.icone}>{espaco.icone}</Text>
                    <Text style={styles.nome}>{espaco.nome}</Text>
                </View>

                <Text style={styles.titulo}>Escolha o dia</Text>
                <View style={styles.linha}>
                    {dias.map((d) => {
                        const ativo = d.chave === dia.chave;
                        return (
                            <TouchableOpacity
                                key={d.chave}
                                style={[styles.chip, ativo && styles.chipAtivo]}
                                onPress={() => setDia(d)}
                                accessibilityRole="button"
                                accessibilityState={{ selected: ativo }}
                            >
                                <Text style={[styles.textoChip, ativo && styles.textoAtivo]}>{d.rotulo}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <Text style={styles.titulo}>Escolha o horário</Text>
                <View style={styles.linha}>
                    {horarios.map((h) => {
                        const ocupado = ocupados.includes(h);
                        const desativado = ocupado || jaPassou(h);
                        const ativo = h === hora;
                        return (
                            <TouchableOpacity
                                key={h}
                                style={[
                                    styles.horario,
                                    ativo && styles.horarioAtivo,
                                    desativado && styles.horarioDesativado,
                                ]}
                                disabled={desativado}
                                onPress={() => setHora(h)}
                                accessibilityRole="button"
                                accessibilityLabel={`${h}${ocupado ? ', ocupado' : jaPassou(h) ? ', já passou' : ''}`}
                                accessibilityState={{ selected: ativo, disabled: desativado }}
                            >
                                <Text style={[styles.textoHorario, ativo && styles.textoAtivo]}>{h}</Text>
                                {ocupado && <Text style={styles.textoOcupado}>Ocupado</Text>}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>

            {/* Botão fixo no rodapé: só habilita depois de escolher um horário */}
            <View style={styles.rodape}>
                <TouchableOpacity
                    style={[styles.botao, !hora && styles.botaoDesativado]}
                    onPress={confirmar}
                    disabled={!hora}
                    accessibilityRole="button"
                    accessibilityState={{ disabled: !hora }}
                >
                    <Text style={styles.textoBotao}>
                        {hora ? `Confirmar reserva · ${dia.rotulo} às ${hora}` : 'Escolha um horário'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: cores.fundo },
    cabecalho: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    icone: { fontSize: 36, marginRight: 12 },
    nome: { fontSize: 22, fontWeight: 'bold', color: cores.texto, flex: 1 },
    titulo: { fontSize: 16, fontWeight: 'bold', color: cores.texto, marginTop: 20, marginBottom: 10 },
    linha: { flexDirection: 'row', flexWrap: 'wrap' },
    chip: {
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: cores.azul,
        backgroundColor: cores.branco,
        marginRight: 8,
        marginBottom: 8,
        minHeight: 44,
        justifyContent: 'center',
    },
    chipAtivo: { backgroundColor: cores.azul },
    textoChip: { color: cores.azul, fontWeight: '600' },
    textoAtivo: { color: cores.branco },
    horario: {
        width: '31%',
        marginRight: '2%',
        marginBottom: 10,
        paddingVertical: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: cores.primaria,
        backgroundColor: cores.branco,
        alignItems: 'center',
        minHeight: 48,
    },
    horarioAtivo: { backgroundColor: cores.primaria },
    horarioDesativado: { backgroundColor: '#eeeeee', borderColor: cores.desativado },
    textoHorario: { fontSize: 16, fontWeight: '600', color: cores.primaria },
    textoOcupado: { fontSize: 11, color: cores.textoSuave },
    rodape: { padding: 16, backgroundColor: cores.branco, elevation: 8 },
    botao: {
        backgroundColor: cores.primaria,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        minHeight: 48,
    },
    botaoDesativado: { backgroundColor: cores.desativado },
    textoBotao: { color: cores.branco, fontSize: 16, fontWeight: 'bold' },
});