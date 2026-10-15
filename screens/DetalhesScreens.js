import { TouchableOpacity } from "react-native";
import { Text } from "react-native-gesture-handler";
import { View } from "react-native/types_generated/index";

export default function DetalhesScreen({ route }) {
  const { item } = route.params;
  return(
    <View style={styles.container}>
        <View>
            renderItem={({ item }) => (
                <View style={styles.item}>
                    <View style={styles.info}>
                        <Text style={styles.nome}>{item.nome}</Text>
                        <Text style={styles.descricao}>{item.descricao}</Text>
                    </View>
                </View>
            )}
        </View>
        <View>
            <TouchableOpacity onPress={() => navigation.navigate('Lista')}>
                <Text>Voltar</Text>
            </TouchableOpacity>
        </View>
    </View>
    
  )
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  item: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  nome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  descricao: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 2,
  },
})

