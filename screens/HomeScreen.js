import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { cores } from '../services/cores';

export default function HomeScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.emoji}>🌳</Text>
            <Text style={styles.titulo} accessibilityRole="header">
                Parque Vivo
            </Text>

            <Text style={styles.texto}>
                Bem-vindo ao Parque da Vila São João! Veja o mapa, encontre os espaços
                acessíveis e agende a sua quadra de forma rápida e simples.
            </Text>

            {/* Botão principal: leva ao mapa (Tela 2) */}
            <TouchableOpacity
                style={styles.botao}
                onPress={() => navigation.navigate('Lista')}
                accessibilityRole="button"
                accessibilityLabel="Ver Mapa"
            >
                <Text style={styles.textoBotao}>Ver Mapa</Text>
            </TouchableOpacity>

            <Text style={styles.rodape}>Protótipo · sem login</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: cores.fundo,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 28,
    },
    emoji: { fontSize: 72 },
    titulo: { fontSize: 34, fontWeight: 'bold', color: cores.primaria, marginTop: 8 },
    texto: {
        fontSize: 17,
        lineHeight: 25,
        color: cores.texto,
        textAlign: 'center',
        marginVertical: 24,
    },
    botao: {
        backgroundColor: cores.primaria,
        paddingVertical: 16,
        paddingHorizontal: 48,
        borderRadius: 12,
        minHeight: 48,
    },
    textoBotao: { color: cores.branco, fontSize: 18, fontWeight: 'bold' },
    rodape: { position: 'absolute', bottom: 24, color: cores.textoSuave, fontSize: 12 },
});