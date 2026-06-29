# Go-Live Anleitung – Duck House

Drei Schritte, damit die neue Seite die alte (duckhouse.de) ersetzt:
**A) Firestore-Regeln · B) Domain umstellen · C) Veröffentlichen.**

---

## A) Firestore-Regeln setzen (einmalig)

Ohne diese Regeln funktionieren Speisekarte-Verwaltung und Bestellungen nicht.

1. [Firebase Console](https://console.firebase.google.com/) → Projekt **duckhouse-4e363** öffnen.
2. Links **Firestore Database** → Reiter **Regeln**.
3. Inhalt komplett ersetzen durch:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Öffentliche Speisekarte: jeder darf lesen, nur eingeloggt schreiben
    match /menu/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Entwurf der Speisekarte (intern): nur eingeloggt
    match /menu_draft/{doc} {
      allow read, write: if request.auth != null;
    }

    // Bestellungen (intern): nur eingeloggt
    match /orders/{doc} {
      allow read, write: if request.auth != null;
    }
  }
}
```

4. **Veröffentlichen** klicken.

> Hinweis: Ein interner Benutzer muss in **Firebase → Authentication** existieren (E-Mail/Passwort), damit der Login funktioniert.

---

## B) Domain duckhouse.de auf die neue Seite umstellen

Die Seite läuft über **GitHub Pages**. Ziel: `duckhouse.de` zeigt auf die neue Seite.

### 1. Beim Domain-Anbieter (wo duckhouse.de registriert ist) DNS setzen

**Apex (duckhouse.de) – vier A-Records:**
```
A   @   185.199.108.153
A   @   185.199.109.153
A   @   185.199.110.153
A   @   185.199.111.153
```

**www (www.duckhouse.de) – ein CNAME:**
```
CNAME   www   ihhallo46-maker.github.io
```

*(Optional IPv6, vier AAAA-Records auf `@`: 2606:50c0:8000::153, 2606:50c0:8001::153, 2606:50c0:8002::153, 2606:50c0:8003::153)*

### 2. In GitHub (Repo first-angular-app)
- **Settings → Pages → Custom domain**: `duckhouse.de` eintragen, speichern.
- Nach DNS-Prüfung **„Enforce HTTPS"** aktivieren (kann 1–24 h dauern, bis das Zertifikat bereit ist).

> Wichtig: Bei eigener Domain läuft die Seite im **Wurzelverzeichnis** (`/`), nicht mehr unter `/first-angular-app/`. Dafür ist das Skript `deploy:domain` da (siehe C).

---

## C) Veröffentlichen

### Mit eigener Domain (nach Schritt B):
```
npm run deploy:domain
```
Das baut mit Base-Href `/`, erzeugt die `404.html` (SPA-Fallback) und setzt die `CNAME`-Datei automatisch auf `duckhouse.de`.

### Solange noch die github.io-Adresse genutzt wird:
```
npm run deploy:gh
```

> Immer eines dieser Skripte verwenden – **nicht** nur `npx angular-cli-ghpages`, sonst fehlt die `404.html` und Direktlinks wie `/menu` oder `/orders` liefern 404.

---

## Schnell-Check nach dem Go-Live
- [ ] `duckhouse.de` lädt die neue Startseite (HTTPS, Schloss-Symbol)
- [ ] `duckhouse.de/menu` direkt aufrufen → lädt (kein 404)
- [ ] Speisekarte zeigt Gerichte (Firestore-Daten)
- [ ] Intern einloggen → Bestellungen + Speisekarte verwalten funktionieren
- [ ] Sprachen DE/EN/ZH umschaltbar
- [ ] Auf dem Handy testen (Speisekarte, Bestell-Modal)
