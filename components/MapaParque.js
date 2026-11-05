import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { pontos, tiposPonto } from '../services/espacos';
import { cores } from '../services/cores';

export default function MapaParque({ selecionadoId, onSelecionar }) {
    return (
        <View>
            <View style={styles.mapa} accessibilityLabel="Mapa do parque com os pontos de interesse">
                {/* Caminhos decorativos */}
                <View style={styles.caminhoHorizontal} />
                <View style={styles.caminhoVertical} />

                {/* Marcadores: cada ponto é um botão com ícone */}
                {pontos.map((p) => {
                    const ativo = p.id === selecionadoId;
                    return (
                        <TouchableOpacity
                            key={p.id}
                            style={[
                                styles.marcador,
                                { left: `${p.x}%`, top: `${p.y}%`, borderColor: tiposPonto[p.tipo].cor },
                                ativo && { backgroundColor: tiposPonto[p.tipo].cor },
                            ]}
                            onPress={() => onSelecionar(p.id)}
                            accessibilityRole="button"
                            accessibilityLabel={`${p.nome}, ${tiposPonto[p.tipo].rotulo}`}
                        >
                            <Text style={styles.icone}>{p.icone}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Legenda (cor + nome) */}
            <View style={styles.legenda}>
                {Object.values(tiposPonto).map((t) => (
                    <View key={t.rotulo} style={styles.legendaItem}>
                        <View style={[styles.ponto, { backgroundColor: t.cor }]} />
                        <Text style={styles.textoLegenda}>{t.rotulo}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mapa: {
        height: 280,
        backgroundColor: '#dcedc8',
        borderRadius: 12,
        overflow: 'hidden',
    },
    caminhoHorizontal: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: '46%',
        height: 14,
        backgroundColor: '#efe6d0',
    },
    caminhoVertical: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: '46%',
        width: 14,
        backgroundColor: '#efe6d0',
    },
    marcador: {
        position: 'absolute',
        width: 44, // área de toque mínima recomendada
        height: 44,
        marginLeft: -22,
        marginTop: -22,
        borderRadius: 22,
        borderWidth: 3,
        backgroundColor: cores.branco,
        alignItems: 'center',
        justifyContent: 'center',
    },
    icone: { fontSize: 22 },
    legenda: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
    legendaItem: { flexDirection: 'row', alignItems: 'center', marginRight: 16, marginBottom: 4 },
    ponto: { width: 12, height: 12, borderRadius: 6, marginRight: 6 },
    textoLegenda: { fontSize: 12, color: cores.textoSuave },
});