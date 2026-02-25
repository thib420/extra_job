# Extra Job - MVP mobile (iPhone)

Application Expo/React Native en francais pour publier et trouver des aides benevoles du quotidien (style Leboncoin).

## Stack MVP

- React Native + Expo + TypeScript
- Expo Router (routing file-based)
- Supabase (Auth + PostgreSQL + Storage + Realtime)
- Zustand (etat auth)
- react-native-maps (vue carte)
- API Adresse (`api-adresse.data.gouv.fr`) pour autocompletion

## Fonctionnalites deja posees (MVP)

- Navigation principale 4 onglets: `Recherche`, `Publier`, `Messages`, `Profil`
- Ecrans:
  - Recherche avec filtres + tri + toggle liste/carte
  - Publication d'annonce avec adresse auto-complete
  - Detail annonce avec actions candidater/contacter
  - Messagerie MVP (UI chat)
  - Auth: email/password, Apple Sign-In, Google OAuth (Expo + Supabase)
  - Profil, mes annonces, mes candidatures
- Theme UI en francais avec palette:
  - Vert primaire `#22C55E`
  - Bleu fonce secondaire `#1E3A5F`
  - Accent urgent `#F59E0B`

## Prerequis

- Node 20+
- npm
- Xcode (si test iOS simulateur)
- Projet Supabase

## Installation

```bash
npm install
cp .env.example .env
```

Renseigner `.env`:

```env
EXPO_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

## Base de donnees Supabase

1. Ouvrir le SQL Editor Supabase.
2. Executer le script [`supabase/schema.sql`](./supabase/schema.sql).
3. Verifier que le bucket `listing-photos` existe.

Le script cree:
- Enums categories/statuts
- Tables `users`, `listings`, `applications`, `conversations`, `messages`, `reviews`, `reports`
- Index + trigger `updated_at`
- Trigger auto-profil depuis `auth.users`
- Politiques RLS MVP

## Lancer le projet

```bash
npm run start
```

Puis:
- `i` pour simulateur iOS
- ou scanner via Expo Go

## Commandes utiles

```bash
npm run ios
npm run android
npx tsc --noEmit
```

## Limites MVP actuelles

- Certaines actions restent en mode "demo" (alerts/placeholder)
- Realtime chat et notifications push non finalises
- Flux complet candidature/acceptation a brancher pleinement au backend
- OAuth Google/Apple necessite configuration providers cote Supabase + Apple Developer

## Etapes conseillees ensuite

1. Brancher totalement `search/publish/listing` sur Supabase (sans mock data).
2. Finaliser candidatures + mise a jour `spots_filled`.
3. Activer realtime messages + notifications push (Edge Functions).
4. Ajouter tests E2E du flux publier -> candidater -> accepter -> chat -> avis.

---

## Web App (Landing / Marketing)

Le dossier `web/` contient l'application web de landing/marketing construite avec **React + Vite + shadcn/ui + Tailwind CSS** (generee via Lovable).

**Stack:**
- React + Vite + TypeScript
- shadcn/ui + Tailwind CSS
- Meme backend Supabase que l'app mobile

**Lancer le web app:**

```bash
cd web
npm install
npm run dev
# → http://localhost:8080
```

**Depuis la racine du monorepo:**

```bash
npm run web:dev    # lancer en developpement
npm run web:build  # builder pour la production
```

**Variables d'environnement (`web/.env`):**

```env
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
```

Copier les memes valeurs que `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY` de l'app mobile, en changeant le prefixe en `VITE_`.
