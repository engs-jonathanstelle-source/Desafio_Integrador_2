// ============================================================
//  CONFIGURAÇÃO DA API  (único arquivo para mexer ao ligar o Spring Boot)
// ============================================================
// 1. Suba o Spring Boot.
// 2. Troque USAR_API para true.
// 3. Ajuste BASE_URL (Android Emulator: http://10.0.2.2:8080 | celular físico: IP do PC).
//
// Enquanto USAR_API = false, tudo é salvo localmente no aparelho (AsyncStorage).
export const USAR_API = false;
export const BASE_URL = 'http://10.0.2.2:8080/api';
