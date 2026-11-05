# API do Parque Urbano (Spring Boot)

Java 17+ e Maven. Banco padrão: H2 em arquivo (`api/data/`), sem instalar nada.

## Rodar

```bash
cd api
mvn spring-boot:run
```

(ou abra a pasta `api` no IntelliJ / VS Code com a extensão Java e execute `ParqueApiApplication`).
Sobe em http://localhost:8080. Na primeira execução os lugares (ids 6 a 13, os mesmos de `data/lugares.js` do app) são cadastrados.

**PostgreSQL:** crie o banco `parque` e rode `mvn spring-boot:run -Dspring-boot.run.profiles=postgres`
(variáveis: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`).

**Segredo do JWT:** em produção defina a variável `JWT_SECRET` (32+ caracteres). O valor padrão serve só para desenvolvimento.

## Rotas

| Método | Rota | Token | Resposta |
|---|---|---|---|
| POST | `/api/auth/register` | não | 201 `{ token, usuario }` · 400 dados inválidos · 409 e-mail já existe |
| POST | `/api/auth/login` | não | 200 `{ token, usuario }` · 401 e-mail ou senha incorretos |
| GET | `/api/lugares` | não | lista de lugares `{ id, nome, descricao, agendavel }` |
| GET | `/api/lugares/{id}` | não | um lugar (404 se não existir) |
| GET | `/api/agendamentos?lugarId=6` | sim | agendamentos de hoje em diante `{ id, lugarId, lugarNome, data, hora, nomeUsuario }` |
| POST | `/api/agendamentos` | sim | 201 criado · 400 · 401 · 404 lugar inexistente · 409 horário já ocupado |

O token vai no cabeçalho `Authorization: Bearer <token>`. Quem agenda é o usuário do token
(os campos `usuarioId`, `nomeUsuario` e `email` que o app envia no POST são ignorados).

```bash
curl -X POST http://localhost:8080/api/auth/register -H "Content-Type: application/json" \
  -d '{"nomeUsuario":"maria","email":"maria@email.com","senha":"123456"}'

curl -X POST http://localhost:8080/api/agendamentos -H "Content-Type: application/json" \
  -H "Authorization: Bearer COLE_O_TOKEN" -d '{"lugarId":9,"data":"2026-12-01","hora":"09:00"}'
```

Regras no servidor: senha guardada com BCrypt, e-mail único, horas cheias de 08:00 a 18:00, sem agendar
data/hora que já passou, e o mesmo lugar/dia/hora nunca duas vezes (também por restrição única no banco).
