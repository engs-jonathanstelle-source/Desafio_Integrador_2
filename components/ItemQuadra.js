import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { cores } from '../services/cores';

// Linha da lista: ícone + nome + botão "Agendar"
export default function ItemQuadra({ ponto, destaque, onAgendar }) {
    return (
        <View style={[styles.item, destaque && styles.destaque]}>
            <View style={styles.iconeBox}>
                <Text style={styles.icone}>{ponto.icone}</Text>
            </View>

            <Text style={styles.nome}>{ponto.nome}</Text>

            <TouchableOpacity
                style={styles.botao}
                onPress={onAgendar}
                accessibilityRole="button"
                accessibilityLabel={`Agendar ${ponto.nome}`}
            >
                <Text style={styles.textoBotao}>Agendar</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: cores.branco,
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 2,
        borderColor: 'transparent',
        elevation: 1,
    },
    destaque: { borderColor: cores.primaria },
    iconeBox: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#e8f5e9',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    icone: { fontSize: 22 },
    nome: { flex: 1, fontSize: 16, fontWeight: '600', color: cores.texto },
    botao: {
        backgroundColor: cores.azul,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        minHeight: 44,
        justifyContent: 'center',
    },
    textoBotao: { color: cores.branco, fontWeight: 'bold' },
});