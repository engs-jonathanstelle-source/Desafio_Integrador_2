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

## Ligar o Spring Boot depois
1. Em `services/config.js`: `USAR_API = true` e ajuste `BASE_URL`.
2. Implemente os endpoints (contratos comentados em `services/authService.js` e `services/agendamentos.js`):
   - `POST /auth/register`, `POST /auth/login` → `{ token, usuario: { id, nomeUsuario, email } }`
   - `GET /agendamentos?lugarId=`, `POST /agendamentos` (409 se lugar+data+hora já existir)
3. Nenhuma tela precisa mudar. O token JWT é enviado automaticamente em `Authorization: Bearer`.

## Imagens
- Mapa: `assets/images/mapa/mapa-parque.png` (Parque Urbano – Implantação Geral e Paisagismo)
- Fachadas: `assets/images/fachadas/` (lista em `data/lugares.js`)
