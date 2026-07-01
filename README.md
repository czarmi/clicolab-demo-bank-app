# CLICOLAB-DEMO-BANK-APP

Architektura mikroserwisowa (kontenery Docker) zaprojektowana tak, aby wybrane
komponenty mogly zostac przeniesione do AWS bez zmiany kodu aplikacji
(np. auth-service -> ECS/Fargate, postgres -> RDS, redis -> ElastiCache,
nginx -> ALB + CloudFront).

## Struktura projektu

```
CLICOLAB-DEMO-BANK-APP/
|-- docker-compose.yml          # orkiestracja wszystkich kontenerow lokalnie
|-- nginx/
|   `-- default.conf            # reverse proxy / API gateway
|-- db/
|   `-- init.sql                 # schemat tabeli users (PostgreSQL)
|-- backend/
|   `-- auth-service/            # mikroserwis uwierzytelniania (Node.js + Express)
|       |-- src/
|       |   |-- config/          # polaczenia: PostgreSQL, Redis, SAML
|       |   |-- middleware/       # weryfikacja JWT
|       |   |-- models/           # zapytania SQL do tabeli users
|       |   |-- routes/           # /register /login /saml/login /saml/callback
|       |   `-- server.js
|       |-- Dockerfile
|       `-- .env.example
`-- frontend/                    # React + Tailwind (wzor: Open-Source Admin Dashboard)
    |-- src/
    |   |-- pages/LoginPage.jsx
    |   |-- pages/RegisterPage.jsx
    |   `-- services/authService.js
    |-- Dockerfile
    `-- tailwind.config.js
```

## Stos technologiczny

- nginx - reverse proxy / API gateway (jeden punkt wejscia, latwy do zamiany na AWS ALB)
- Node.js + Express - mikroserwis auth-service (rejestracja, logowanie lokalne, SAML SSO)
- PostgreSQL - przechowywanie danych uzytkownikow
- Redis - sesje / cache (gotowy do migracji na AWS ElastiCache)
- React + Tailwind CSS - frontend, oparty na szablonie Open-Source Admin Dashboard
- Docker / docker-compose - kazda funkcja jako osobny kontener

## Uwierzytelnianie

1. **Logowanie lokalne** - rejestracja zapisuje uzytkownika (hash bcrypt) w tabeli
   `users` w PostgreSQL, logowanie zwraca token JWT.
2. **SAML SSO** - `passport-saml` obsluguje federacyjne logowanie z dowolnym IdP
   (Azure AD, Okta, Keycloak, ADFS). Po pierwszym logowaniu uzytkownik SAML jest
   automatycznie tworzony w tabeli `users` (auth_provider = 'saml').

## Jak uruchomic lokalnie

```bash
cd CLICOLAB-DEMO-BANK-APP
cp backend/auth-service/.env.example backend/auth-service/.env
docker compose up --build
```

Frontend bedzie dostepny pod `http://localhost/login`,
API auth-service pod `http://localhost/api/auth/*`.

## Migracja do AWS (przyszlosc)

- `auth-service` (kontener Node.js) -> Amazon ECS / EKS / Fargate
- `postgres` -> Amazon RDS for PostgreSQL
- `redis` -> Amazon ElastiCache for Redis
- `nginx` -> Application Load Balancer + opcjonalnie CloudFront
- Kod aplikacji nie wymaga zmian - tylko zmienne srodowiskowe (host bazy danych,
  redis URL, certyfikat SAML) w plikach `.env`.

## Nastepne kroki

- Dodanie strony resetu hasla i potwierdzenia e-mail (osobny mikroserwis notification-service)
- Dodanie middleware RBAC (role uzytkownikow) w auth-service
- Konfiguracja realnego IdP SAML (certyfikat, metadata.xml)
- Wdrozenie CI/CD z GitHub Actions (build obrazow Docker, push do ECR)
