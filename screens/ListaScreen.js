import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import MapaParque from '../components/MapaParque';
import ItemQuadra from '../components/ItemQuadra';
import { pontos } from '../services/espacos';
import { cores } from '../services/cores';

export default function ListaScreen({ navigation }) {
    // Ponto tocado no mapa (destaca a linha correspondente na lista)
    const [selecionadoId, setSelecionadoId] = useState(null);

    // Só os espaços que podem ser agendados
    const espacos = pontos.filter((p) => p.reservavel);

    // Leva o espaço escolhido para a tela de horários
    const agendar = (espaco) => navigation.navigate('Detalhes', { espaco });

    return (
        <FlatList
            style={styles.lista}
            contentContainerStyle={{ padding: 16 }}
            data={espacos}
            keyExtractor={(item) => item.id}
            extraData={selecionadoId}
            // O mapa fica no topo da própria lista (evita FlatList dentro de ScrollView)
            ListHeaderComponent={
                <View>
                    <MapaParque selecionadoId={selecionadoId} onSelecionar={setSelecionadoId} />
                    <Text style={styles.subtitulo} accessibilityRole="header">
                        Quadras e espaços para agendar
                    </Text>
                </View>
            }
            renderItem={({ item }) => (
                <ItemQuadra
                    ponto={item}
                    destaque={item.id === selecionadoId}
                    onAgendar={() => agendar(item)}
                />
            )}
        />
    );
}

const styles = StyleSheet.create({
    lista: { flex: 1, backgroundColor: cores.fundo },
    subtitulo: {
        fontSize: 18,
        fontWeight: 'bold',
        color: cores.texto,
        marginTop: 20,
        marginBottom: 12,
    },
});