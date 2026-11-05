// ============================================================
//  CONFIGURAÇÃO DA API  (único arquivo para mexer ao ligar o Spring Boot)
// ============================================================
// 1. Suba a API Spring Boot (pasta api/, veja api/README.md).
// 2. USAR_API = true usa a API; false volta ao modo local (AsyncStorage, sem backend).
// 3. Endereço da API:
//    - Android Emulator: 10.0.2.2 (é o localhost do computador)
//    - iOS Simulator / navegador (Expo Web): localhost
//    - Celular de verdade (Expo Go): IP do computador na mesma rede Wi-Fi.
//      Crie um arquivo .env com: EXPO_PUBLIC_API_URL=http://192.168.0.10:8080/api
import { Platform } from 'react-native';

export const USAR_API = true;

const HOST_PADRAO = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
export const BASE_URL = process.env.EXPO_PUBLIC_API_URL || `http://${HOST_PADRAO}:8080/api`;
