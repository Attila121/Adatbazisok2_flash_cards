# Adatbázisok 2 Tanulókártya Alkalmazás
Modern, interaktív tanulókártya alkalmazás az Adatbázisok 2 vizsgakérdések gyakorlásához.Felhasználva az https://github.com/BeanieBarrow/adatb2_kerdesek adatbázisok vizsgakérdéseire vonatkozó megoldásokat.
Az alkalmazás React és TypeScript alapokon nyugszik, sötét témával és markdown támogatással.
### Telepítés nélkül github PWA

Elérhető https://attila121.github.io/Adatbazisok2_flash_cards/

### Telepítési lépések

```bash
# Projekt klónozása
git clone [repository-url]
cd flashcards

# Függőségek telepítése
npm install

# Fejlesztői szerver indítása
npm run dev
```

Az alkalmazás ezután elérhető a következő címen: `http://localhost:5173`


## Főbb funkciók

### Tanulási módok
- **Kétféle nézet**:
  - Lapozható kártyák: Klasszikus flashcard élmény kérdés-válasz váltással
  - Párhuzamos megjelenítés: Kérdés és válasz egyidejű megtekintése
- **Tanulási módok**:
  - Összes kérdés gyakorlása
  - Csak ismeretlen kérdések gyakorlása
  - Megjelölt kérdések gyakorlása

### Haladáskövetés
- **Részletes statisztikák**:
  - Ismert/nem ismert kártyák száma
  - Helyes/helytelen válaszok követése kártyánként
  - Utolsó gyakorlás időpontja
  - Megjelölt kártyák száma
- **Folyamatos mentés**:
  - Automatikus haladásmentés
  - Utolsó pozíció megjegyzése
  - Megjelölt kártyák perzisztens tárolása

### Tartalom megjelenítés
- Markdown formázás támogatása
- Kódrészletek szintaxis kiemelése
- Képek és diagramok beágyazása
- Táblázatok és listák formázott megjelenítése

### Navigáció és szűrés
- **Kérdéslista**: Gyors navigáció a kérdések között
- **Tartományválasztó**: Specifikus kérdéscsoportok gyakorlása
- **Kérdések megjelölése**: Fontos vagy ismétlést igénylő kérdések kiemelése
- **Haladásjelző**: Vizuális visszajelzés a gyakorlás előrehaladásáról

### Felhasználói felület
- Reszponzív dizájn: Működik asztali és mobil eszközökön
- Sötét téma
- Intuitív kezelőfelület
- Elegáns animációk és átmenetek

## Technológiák

- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui komponensek
- Lucide ikonok
- Local Storage API a haladás mentéséhez

## Telepítés és Futtatás

### Követelmények
- Node.js >= 16.0.0
- npm >= 7.0.0



## Kérdések szerkesztése

A kérdések a `kerdesek.md` fájlban találhatók, az alábbi formátumban:

```markdown
## 1. Kérdés címe
Kérdés szövege

Válasz szövege
- Tartalmazhat listákat
- Kódrészleteket
- Táblázatokat

![Diagram leírása](./images/diagram.png)
```

### Képek hozzáadása
- A képeket a `/public/images/` mappába kell helyezni
- A képekre a markdown szintaxissal lehet hivatkozni
- A képek automatikusan megjelennek a válaszokban


Készítette: Attila121 - 2024
