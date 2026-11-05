# Parque Urbano – Vila São João (Desafio Integrador)

## Rodar
```
npm install
npx expo install @react-native-async-storage/async-storage
npx expo start
```

## Fluxo
Login / Criar conta (nome de usuário, e-mail, senha) → Home (mapa + fachadas) → Agendamento (dia + horário).
O agendamento é salvo com id, nome de usuário e e-mail de quem fez login.

## API Spring Boot (pasta `api/`)
1. Suba a API: `cd api && mvn spring-boot:run` (veja `api/README.md`). Na primeira vez ela cadastra os 8 lugares.
2. `services/config.js` já está com `USAR_API = true`. Para o celular de verdade, crie `.env` com
   `EXPO_PUBLIC_API_URL=http://IP-DO-PC:8080/api` (modelo em `.env.example`).
3. Rotas usadas pelo app:
   - `POST /api/auth/register`, `POST /api/auth/login` -> `{ token, usuario: { id, nomeUsuario, email } }`
   - `GET /api/lugares` (as fotos continuam no app, ligadas pelo id)
   - `GET /api/agendamentos?lugarId=`, `POST /api/agendamentos` (409 se lugar+data+hora já existir)
   O token JWT é enviado automaticamente em `Authorization: Bearer`.
4. Para voltar ao modo sem backend (AsyncStorage), use `USAR_API = false`.

## Imagens
- Mapa: `assets/images/mapa/mapa-parque.png` (Parque Urbano – Implantação Geral e Paisagismo)
- Fachadas: `assets/images/fachadas/` (lista em `data/lugares.js`)
