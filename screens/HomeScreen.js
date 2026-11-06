import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { MAPA_PARQUE } from '../data/lugares';
import { listarLugares } from '../services/lugares';

const PLACA_LEGENDA = require('../assets/images/fachadas/placa.jpg');

export default function HomeScreen({ navigation }) {
  const { usuario, sair } = useAuth();
  const [lugares, setLugares] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const carregar = useCallback(async () => {
    try {
      setErro(null);
      setCarregando(true);
      setLugares(await listarLugares());
    } catch (e) {
      if (e.message !== 'NAO_AUTORIZADO') {
        setErro(
          e.message === 'SEM_CONEXAO'
            ? 'Não foi possível conectar à API. Confira se ela está rodando e se o endereço está correto.'
            : 'Ocorreu um erro ao carregar os lugares.'
        );
      }
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <View style={styles.topo}>
        <Text style={styles.ola}>Olá, {usuario?.nomeUsuario}!</Text>
        <TouchableOpacity onPress={sair}><Text style={styles.sair}>Sair</Text></TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.mapaScroll}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        nestedScrollEnabled
      >
        <Image source={MAPA_PARQUE} style={styles.mapa} resizeMode="cover" />
      </ScrollView>

      <Image source={PLACA_LEGENDA} style={styles.placa} resizeMode="contain" />

      <Text style={styles.secao}>Escolha um local para agendar</Text>
      {carregando && <ActivityIndicator size="large" color="#2D6A4F" style={{ marginTop: 24 }} />}

      {!carregando && erro && (
        <View style={styles.erroBox}>
          <Text style={styles.erroTexto}>{erro}</Text>
          <TouchableOpacity style={styles.botaoErro} onPress={carregar}>
            <Text style={styles.botaoErroTexto}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      )}

      {!carregando && !erro && lugares.map((lugar) => (
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
  mapaScroll: { marginHorizontal: -16 },
  mapa: { width: 900, height: 316, borderRadius: 7 },
  secao: { fontSize: 16, fontWeight: '800', color: '#1B4332', marginTop: 24, marginBottom: 12 },
  card: { backgroundColor: '#fff', borderRadius: 14, marginBottom: 14, overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
  fachada: { width: '100%', height: 150 },
  cardTexto: { padding: 12 },
  cardNome: { fontSize: 17, fontWeight: '800', color: '#1B4332' },
  agendar: { marginTop: 6, fontSize: 13, fontWeight: '700', color: '#2D6A4F' },
  cardDescricao: { fontSize: 13, color: '#555', marginTop: 2 },
  erroBox: { alignItems: 'center', padding: 16 },
  erroTexto: { color: '#7A1F1F', fontSize: 14, textAlign: 'center', marginBottom: 12 },
  botaoErro: { backgroundColor: '#2D6A4F', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 18 },
  botaoErroTexto: { color: '#fff', fontWeight: '700' },
  placa: { width: '70%', aspectRatio: 70 / 0, marginTop: -400, margin: -400, borderRadius: 12, alignSelf: 'center' },
});
