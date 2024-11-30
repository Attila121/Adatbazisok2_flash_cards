# Adatbázisok 2 Tanulókártya Alkalmazás

Modern, interaktív tanulókártya alkalmazás az Adatbázisok 2 vizsgakérdések gyakorlásához.Felhasználva az https://github.com/BeanieBarrow/adatb2_kerdesek adatbázisok vizsgakérdéseire vonatkozó megoldásokat.
Az alkalmazás React és TypeScript alapokon nyugszik, sötét témával és markdown támogatással.

## Főbb funkciók

- **Két tanulási mód**: 
  - Egyoldalas nézet (kérdés/válasz váltás)
  - Párhuzamos nézet (kérdés és válasz egyszerre)
- **Haladáskövetés**:
  - Ismert/nem ismert kártyák követése
  - Egyéni statisztikák mentése
- **Tartalom megjelenítés**:
  - Markdown formázás
  - Kódrészletek szintaxis kiemeléssel
  - Képek és diagramok támogatása
- **Reszponzív dizájn**: Működik asztali és mobil eszközökön

## Technológiák

- React
- TypeScript
- Tailwind CSS
- shadcn/ui komponensek
- react-markdown
- Local Storage API

## Telepítés

### Követelmények
- Node.js >= 16.0.0
- npm >= 7.0.0

### Lépések

```bash
# Projekt klónozása
git clone [repository-url]
cd flashcards

# Függőségek telepítése
npm install

# Fejlesztői szerver indítása
npm run dev
```

Az alkalmazás ezután elérhető: `http://localhost:5173`

## Kérdések hozzáadása

A kérdések a `kerdesek.md` fájlban találhatók, az alábbi formátumban:

```markdown
## 1. Kérdés címe
Kérdés szövege

Válasz szövege
- Tartalmazhat felsorolást
- Táblázatokat
- Kódrészleteket
```

A képeket a `/public/images/` mappába kell helyezni.