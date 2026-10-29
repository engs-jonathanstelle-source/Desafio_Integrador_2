import React, { useState } from 'react';
import {
  ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, ScrollView,
  StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { LUGARES } from '../data/lugares';

const MENSAGENS = {
  EMAIL_EXISTE: 'Já existe uma conta com esse e-mail.',
  CREDENCIAIS_INVALIDAS: 'E-mail ou senha incorretos.',
};

export default function LoginScreen() {
  const { entrar, registrar } = useAuth();
  const [modoCadastro, setModoCadastro] = useState(false);
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [enviando, setEnviando] = useState(false);

  const enviar = async () => {
    const emailLimpo = email.trim().toLowerCase();
    if (modoCadastro && nomeUsuario.trim().length < 3) return Alert.alert('Atenção', 'O nome de usuário precisa ter ao menos 3 caracteres.');
    if (!/^\S+@\S+\.\S+$/.test(emailLimpo)) return Alert.alert('Atenção', 'Informe um e-mail válido.');
    if (senha.length < 6) return Alert.alert('Atenção', 'A senha precisa ter ao menos 6 caracteres.');

    try {
      setEnviando(true);
      if (modoCadastro) await registrar({ nomeUsuario: nomeUsuario.trim(), email: emailLimpo, senha });
      else await entrar({ email: emailLimpo, senha });
    } catch (e) {
      Alert.alert('Erro', MENSAGENS[e.message] || 'Não foi possível conectar. Tente novamente.');
      setEnviando(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
        <Image source={require('../assets/images/fachadas/chegada.jpg')} style={styles.banner} />
        <Text style={styles.titulo}>Parque Urbano</Text>
        <Text style={styles.subtitulo}>Vila São João</Text>

        <View style={styles.abas}>
          <TouchableOpacity style={[styles.aba, !modoCadastro && styles.abaAtiva]} onPress={() => setModoCadastro(false)}>
            <Text style={[styles.abaTexto, !modoCadastro && styles.abaTextoAtivo]}>Entrar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.aba, modoCadastro && styles.abaAtiva]} onPress={() => setModoCadastro(true)}>
            <Text style={[styles.abaTexto, modoCadastro && styles.abaTextoAtivo]}>Criar conta</Text>
          </TouchableOpacity>
        </View>

        {modoCadastro && (
          <>
            <Text style={styles.label}>Nome de usuário</Text>
            <TextInput style={styles.input} value={nomeUsuario} onChangeText={setNomeUsuario} placeholder="Como quer ser chamado" autoCapitalize="none" />
          </>
        )}

        <Text style={styles.label}>E-mail</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="voce@email.com" keyboardType="email-address" autoCapitalize="none" />

        <Text style={styles.label}>Senha</Text>
        <TextInput style={styles.input} value={senha} onChangeText={setSenha} placeholder="Mínimo 6 caracteres" secureTextEntry autoCapitalize="none" />

        <TouchableOpacity style={[styles.botao, enviando && { opacity: 0.6 }]} onPress={enviar} disabled={enviando}>
          {enviando ? <ActivityIndicator color="#fff" /> : <Text style={styles.botaoTexto}>{modoCadastro ? 'Criar conta' : 'Entrar'}</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const VERDE = '#2D6A4F';
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F5F0' },
  conteudo: { padding: 20, paddingTop: 60, paddingBottom: 40 },
  banner: { width: '100%', height: 150, borderRadius: 14, marginBottom: 16 },
  titulo: { fontSize: 28, fontWeight: '800', color: '#1B4332' },
  subtitulo: { fontSize: 15, color: '#555', marginBottom: 20 },
  abas: { flexDirection: 'row', backgroundColor: '#E3E9E0', borderRadius: 10, padding: 4 },
  aba: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  abaAtiva: { backgroundColor: '#fff' },
  abaTexto: { fontWeight: '600', color: '#666' },
  abaTextoAtivo: { color: '#1B4332' },
  label: { fontSize: 14, fontWeight: '700', color: '#1B4332', marginTop: 16, marginBottom: 8 },
  input: { backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#D5DDD3', paddingHorizontal: 12, paddingVertical: 10, fontSize: 15 },
  botao: { backgroundColor: VERDE, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 28 },
  botaoTexto: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
