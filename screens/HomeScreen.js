import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { LUGARES, MAPA_PARQUE } from '../data/lugares';

export default function HomeScreen({ navigation }) {
  const { usuario, sair } = useAuth();

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <View style={styles.topo}>
        <Text style={styles.ola}>Olá, {usuario.nomeUsuario}!</Text>
        <TouchableOpacity onPress={sair}><Text style={styles.sair}>Sair</Text></TouchableOpacity>
      </View>

      <Image source={MAPA_PARQUE} style={styles.mapa} resizeMode="contain" />

      <Text style={styles.secao}>Escolha um local para agendar</Text>
      {LUGARES.map((lugar) => (
        <TouchableOpacity
  key={lugar.id}
  style={styles.card}
  activeOpacity={0.85}
  disabled={!lugar.agendavel}
  onPress={() => lugar.agendavel && navigation.navigate('Agendamento', { lugar })}
>
          <Image source={lugar.imagem} style={styles.fachada} resizeMode="cover" />
          <View style={styles.cardTexto}>
            
            <Text style={styles.cardNome}>{lugar.nome}</Text>
            <Text style={styles.cardDescricao}>{lugar.descricao}</Text>
            {lugar.agendavel && <Text style={styles.agendar}>Toque para agendar →</Text>}
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F5F0' },
  topo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  ola: { fontSize: 18, fontWeight: '700', color: '#1B4332' },
  sair: { color: '#2D6A4F', fontWeight: '700' },
  mapa: { width: '1000%', aspectRatio: 1536 / 1024, borderRadius: 12, backgroundColor: '#fff' },
  secao: { fontSize: 16, fontWeight: '800', color: '#1B4332', marginTop: 24, marginBottom: 12 },
  card: { backgroundColor: '#fff', borderRadius: 14, marginBottom: 14, overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
  fachada: { width: '100%', height: 150 },
  cardTexto: { padding: 12 },
  cardNome: { fontSize: 17, fontWeight: '800', color: '#1B4332' },
  agendar: { marginTop: 6, fontSize: 13, fontWeight: '700', color: '#2D6A4F' },
  cardDescricao: { fontSize: 13, color: '#555', marginTop: 2 },
});
