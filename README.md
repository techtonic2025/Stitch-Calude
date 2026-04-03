# LearnAI Academy

Piattaforma full-stack per la vendita di corsi AI, con design system "The Neon Laboratory".

## Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS v3 + React Router v6 + React Query
- **Backend**: Express + TypeScript + Prisma ORM + SQLite + JWT + bcryptjs
- **Design**: "The Neon Laboratory" — dark teal glassmorphism, atmospheric glows, Plus Jakarta Sans + Inter

## Avvio

### Backend
```bash
cd backend
npm install
npm run db:push      # crea il database SQLite
npm run db:seed      # popola con 6 corsi e utenti demo
npm run dev          # avvia su http://localhost:3001
```

### Frontend
```bash
cd frontend
npm install
npm run dev          # avvia su http://localhost:5173
```

## Credenziali demo
- `admin@learnai.com` / `password123`
- `sarah@example.com` / `password123`

## Pagine

| Rotta | Descrizione |
|-------|-------------|
| `/` | Homepage — hero, features, corsi in evidenza, testimonianze |
| `/courses` | Catalogo con filtri per categoria e livello |
| `/courses/:slug` | Dettaglio corso — curriculum, istruttore, acquisto |
| `/pricing` | Piani Free / Professional ($29/mo) / Enterprise |
| `/about` | Team, valori, statistiche |
| `/login` | Login con JWT |
| `/register` | Registrazione |
| `/checkout/:courseId` | Checkout con form carta (mock Stripe) |
| `/dashboard` | I miei corsi (richiede autenticazione) |

## API Backend

```
GET    /api/courses              — lista corsi (filtri: category, level, search)
GET    /api/courses/:slug        — dettaglio corso
POST   /api/auth/register        — registrazione
POST   /api/auth/login           — login → JWT
GET    /api/users/me             — profilo utente (auth)
GET    /api/users/me/enrollments — corsi acquistati (auth)
POST   /api/payments/checkout    — crea intent di pagamento (auth)
POST   /api/payments/confirm     — conferma pagamento → iscrizione (auth)
POST   /api/courses/:id/review   — aggiungi recensione (auth, richiede iscrizione)
```
