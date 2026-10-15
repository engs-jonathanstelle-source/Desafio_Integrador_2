import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useFavoritos } from '../contexts/ThemeContexts';

export default function HomeScreen(){
        <View styles={styles.container}>
            <Text styles={styles.titulo}>Meu App</Text>
        </View>
}
        

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f6fa',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    titulo: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 10,
    },
});