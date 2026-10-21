import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Tela inicial do app Parque Vivo
export default function HomeScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            <Text style={styles.titulo}>Parque Vivo</Text>
            <Text style={styles.subtitulo}>
                Conheça o Parque da Vila São João
            </Text>

            {/* Botão que navega para a tela do mapa */}
            <TouchableOpacity
                style={styles.botao}
                onPress={() => navigation.navigate('Lista')}
                accessibilityRole="button"
                accessibilityLabel="Abrir o mapa do parque"
            >
                <Text style={styles.textoBotao}>Ver mapa do parque</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1F8E9',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    titulo: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#2E7D32',
        marginBottom: 8,
    },
    subtitulo: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginBottom: 32,
    },
    botao: {
        backgroundColor: '#2E7D32',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 12,
        elevation: 3,
    },
    textoBotao: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
});