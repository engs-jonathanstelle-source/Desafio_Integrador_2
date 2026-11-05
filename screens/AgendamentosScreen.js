import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { criarAgendamento, listarPorLugar } from '../services/agendamentos';
import { useAuth } from '../contexts/AuthContext';

const HORARIOS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

// Formata a data local como AAAA-MM-DD (evita problemas de fuso do toISOString)
const formatarISO = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const formatarBR = (iso) => {
  const [a, m, d] = iso.split('-');
  return `${d}/${m}/${a}`;
};

// Próximos 14 dias
const gerarDias = () => {
  const dias = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    dias.push({ iso: formatarISO(d), diaSemana: DIAS_SEMANA[d.getDay()], dia: String(d.getDate()).padStart(2, '0') });
  }
  return dias;
};

export default function AgendamentoScreen({ route, navigation }) {
  const { lugar } = route.params;
  const { usuario } = useAuth();
  const dias = useMemo(gerarDias, []);

  const [agendamentos, setAgendamentos] = useState([]);
  const [data, setData] = useState(null);
  const [hora, setHora] = useState(null);
  const [salvando, setSalvando] = useState(false);

  const carregar = useCallback(async () => {
    try {
      const lista = await listarPorLugar(lugar.id);
      // garante ordenação por data e hora
      setAgendamentos([...lista].sort((a, b) => (a.data + a.hora).localeCompare(b.data + b.hora)));
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível carregar os agendamentos. Verifique sua conexão.');
    }
  }, [lugar.id]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  const ocupado = (iso, h) => agendamentos.some((a) => a.data === iso && a.hora === h);

  const passou = (iso, h) => {
    if (iso !== formatarISO(new Date())) return false;
    const [hh] = h.split(':').map(Number);
    return hh <= new Date().getHours();
  };

  const validar = () => {
    if (!data) return 'Escolha o dia.';
    if (!hora) return 'Escolha o horário.';
    return null;
  };

  const enviar = async () => {
    const erro = validar();
    if (erro) return Alert.alert('Atenção', erro);

    try {
      setSalvando(true);
      await criarAgendamento({
        lugarId: lugar.id,
        lugarNome: lugar.nome,
        data,
        hora,
        usuarioId: usuario.id,
        nomeUsuario: usuario.nomeUsuario,
        email: usuario.email,
      });
      await carregar();
      Alert.alert('Agendado!', `${lugar.nome} reservado para ${formatarBR(data)} às ${hora}.`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      if (e.message === 'CONFLITO') {
        await carregar();
        setHora(null);
        Alert.alert('Horário indisponível', 'Alguém acabou de agendar esse horário. Escolha outro.');
      } else {
        Alert.alert('Erro', 'Não foi possível salvar o agendamento. Tente novamente.');
      }
    } finally {
      setSalvando(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <Text style={styles.titulo}>{lugar.nome}</Text>
        <Text style={styles.subtitulo}>{lugar.descricao}</Text>

        <Text style={styles.label}>Dia</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {dias.map((d) => {
            const sel = data === d.iso;
            return (
              <TouchableOpacity
                key={d.iso}
                style={[styles.diaChip, sel && styles.chipSelecionado]}
                onPress={() => {
                  setData(d.iso);
                  setHora(null);
                }}
              >
                <Text style={[styles.diaSemana, sel && styles.textoSelecionado]}>{d.diaSemana}</Text>
                <Text style={[styles.diaNumero, sel && styles.textoSelecionado]}>{d.dia}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <Text style={styles.label}>Horário</Text>
        {!data ? (
          <Text style={styles.aviso}>Escolha um dia para ver os horários.</Text>
        ) : (
          <View style={styles.horarios}>
            {HORARIOS.map((h) => {
              const indisponivel = ocupado(data, h) || passou(data, h);
              const sel = hora === h;
              return (
                <TouchableOpacity
                  key={h}
                  disabled={indisponivel}
                  style={[styles.horaChip, sel && styles.chipSelecionado, indisponivel && styles.chipIndisponivel]}
                  onPress={() => setHora(h)}
                >
                  <Text style={[styles.horaTexto, sel && styles.textoSelecionado, indisponivel && styles.textoIndisponivel]}>{h}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <Text style={styles.aviso}>Agendando como {usuario.nomeUsuario} ({usuario.email})</Text>

        <TouchableOpacity style={[styles.botao, salvando && { opacity: 0.6 }]} onPress={enviar} disabled={salvando}>
          <Text style={styles.botaoTexto}>{salvando ? 'Salvando...' : 'Confirmar agendamento'}</Text>
        </TouchableOpacity>

        <Text style={[styles.label, { marginTop: 32 }]}>Agendamentos neste local</Text>
        {agendamentos.length === 0 ? (
          <Text style={styles.aviso}>Nenhum agendamento ainda. Seja o primeiro!</Text>
        ) : (
          agendamentos.map((a) => (
            <View key={a.id} style={styles.itemAgendado}>
              <Text style={styles.itemData}>
                {formatarBR(a.data)} às {a.hora}
              </Text>
              <Text style={styles.itemNome}>Reservado por {a.nomeUsuario}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const VERDE = '#2D6A4F';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F5F0' },
  titulo: { fontSize: 22, fontWeight: '800', color: '#1B4332' },
  subtitulo: { fontSize: 14, color: '#555', marginTop: 2 },
  label: { fontSize: 14, fontWeight: '700', color: '#1B4332', marginTop: 20, marginBottom: 8 },
  aviso: { color: '#777', fontSize: 14 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D5DDD3',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  diaChip: {
    width: 56,
    paddingVertical: 10,
    marginRight: 8,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D5DDD3',
    alignItems: 'center',
  },
  diaSemana: { fontSize: 12, color: '#555' },
  diaNumero: { fontSize: 18, fontWeight: '700', color: '#1B4332' },
  horarios: { flexDirection: 'row', flexWrap: 'wrap' },
  horaChip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D5DDD3',
  },
  horaTexto: { fontSize: 14, fontWeight: '600', color: '#1B4332' },
  chipSelecionado: { backgroundColor: VERDE, borderColor: VERDE },
  textoSelecionado: { color: '#fff' },
  chipIndisponivel: { backgroundColor: '#E5E5E5', borderColor: '#E5E5E5' },
  textoIndisponivel: { color: '#A0A0A0', textDecorationLine: 'line-through' },
  botao: { backgroundColor: VERDE, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 24 },
  botaoTexto: { color: '#fff', fontSize: 16, fontWeight: '700' },
  itemAgendado: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: VERDE,
  },
  itemData: { fontSize: 15, fontWeight: '700', color: '#1B4332' },
  itemNome: { fontSize: 13, color: '#555', marginTop: 2 },
});

