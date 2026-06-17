# 🧪 Testumgebung (Staging) erstellen – Schritt für Schritt

Die Testumgebung läuft über **Firebase Hosting Preview-Channels**: eine temporäre,
öffentlich erreichbare Kopie der Seite mit eigener URL – getrennt von der echten Live-Seite.

## Konzept in einem Satz

> Die App wird gebaut (`ng build`) und nicht auf die Live-Seite geladen, sondern auf einen
> **Channel namens `staging`**, der eine eigene Test-URL bekommt und nach 30 Tagen automatisch abläuft.

---

## Einmalig (nur beim ersten Mal / neuem Rechner)

**1. Bei Firebase einloggen**

```bash
npm run firebase:login
```

Öffnet den Browser → mit dem Google-Account anmelden. Muss man nur einmal pro Rechner machen.

> Das Projekt ist bereits fest verbunden: `.firebaserc` zeigt auf `duckhouse-4e363`.
> Da muss nichts mehr eingestellt werden.

---

## Jedes Mal, wenn etwas getestet werden soll

**2. Staging-Version deployen**

```bash
npm run deploy:staging
```

Dieser eine Befehl macht automatisch zwei Dinge (definiert in `package.json`):

1. `ng build` → baut die App nach `dist/first-angular-app/browser`
2. `firebase hosting:channel:deploy staging --expires 30d` → lädt das Ergebnis auf den `staging`-Channel hoch

**3. Test-URL öffnen**

Am Ende gibt der Befehl eine URL aus, die so aussieht:

```
✔ Channel URL (staging): https://duckhouse-4e363--staging-xxxxx.web.app
```

Diese URL ist die Testumgebung. Teilen/öffnen, prüfen, fertig. ✅

---

## Wenn der Test gut war → echt live schalten

```bash
npm run deploy:firebase
```

Das deployed auf die **richtige Live-Seite** (nicht mehr nur den Test-Channel).

---

## Übersicht

| Befehl                      | Was er macht                            | URL                       |
| --------------------------- | --------------------------------------- | ------------------------- |
| `npm run deploy:staging`    | Test-Version (läuft nach 30 Tagen ab)   | `…--staging-….web.app`    |
| `npm run deploy:firebase`   | Echte Live-Version                      | Haupt-Domain              |

---

## Wichtig zu wissen

- **Kein globales `firebase-tools` nötig** – alles läuft über `npx --yes firebase-tools`,
  deshalb funktioniert es auf jedem Rechner.
- Ein erneutes `npm run deploy:staging` **überschreibt** den alten Staging-Channel
  (es sammeln sich keine 100 URLs an).
- Der 30-Tage-Ablauf ist nur eine Aufräum-Automatik; einfach neu deployen, dann gibt es wieder 30 Tage.
