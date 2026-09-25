# DRR Racing — l'app pubblica dei fan

Progetto separato da DRR Paddock (Billy, 25 settembre 2026). Legge **solo** i
dati pubblici di Paddock da `https://app.dilawrirossocorsa.com/api/pubblico`
(variabile `PADDOCK_URL` per cambiarlo). Cosa si vede lo decide Paddock:
Admin > DRR Racing (sito, social, schede piloti, eventi visibili), la stella
sulle foto in Media, e i Risultati DRR degli eventi.

Pagine: Home (prossimo evento con countdown, ultimi risultati, foto, link),
Calendario, Evento (orari con countdown e risultati), Piloti (schede),
Classifica, Foto. Italiano e inglese (tasto in alto).

## Pubblicazione
1. Repo GitHub vuoto `drr-racing-app`, poi push.
2. Progetto Vercel nuovo collegato al repo (nessuna variabile obbligatoria).
3. Dominio, per esempio `racing.dilawrirossocorsa.com`.
4. Store: guscio Capacitor come Paddock, che punta al dominio (da fare).
