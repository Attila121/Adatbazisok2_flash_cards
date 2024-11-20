<!-- Nested bullet points -->
## 1. Mit hívunk statikus, és mit dinamikus adatbázisnak? (1 pont) 

- Statikus adatbázis:
  - Ritkán módosul
  - A lekérdezések gyorsasága a fontosabb
- Dinamikus adatbázis:
  - Gyakran módosul
  - Ritkán végzünk lekérdezést

<!-- Bullet point with a new break line -->
## 3. Mit tételezünk fel, mivel arányos a beolvasás, kiírás költsége? (1 pont)

- Feltételezzük, hogy a beolvasás, kiírás költsége arányos a háttértároló és
  memória között mozgatott blokkok számával.

<!-- Bullet points with  `l`(code) and (_length_) (italic style) -->
## 4. Adjuk meg az alábbi paraméterek jelentését! l, b, B, T, bf, M, I(A) (7 pont)

- `l` (_length_): rekordméret (bájtokban)
- `b`: blokkméret (bájtokban)
- `T` (_tuple_): rekordok száma 
- `B`: a fájl mérete blokkokban
- `bf`: blokkolási faktor
  - (mennyi rekord fér el egy blokkban: bf = &LeftFloor;b/l&RightFloor; (alsó egészrész)
- B = &LeftCeiling;T/bf&RightCeiling; (felső egészrész)
- `M`: memória mérete blokkokban
- `I(A)`: képméret, az A oszlopban szereplő különböző értékek száma
  - `I(A)` = | &Pi;<sub>A</sub> (R) |

<!-- Answer has <code>  -->
## 5. Adjuk meg RxS méretét blokkokban kifejezve! (2 pont)

```text
B(RxS) = (T(R) * T(S)) * (l(R) + l(S)) / b =
       = (T(S) * T(R) * l(R)/b) + (T(R) * T(S) * l(S)/b) =
       = T(S) * B(R) + T(R) * B(S)
```

<!-- Has symbole -->
## 9. Egyenletességi feltétel esetén hány blokkból áll a sA=a(R) lekérdezés eredménye? (1 pont)

- B(&sigma;<sub>A = a</sub>(R)) = B(R) / I(A)


## 13. Mit mond meg a h(x) hasító függvény értéke? (1 pont)

- Egy h(x) &in; {1, …, K} hasító függvény értéke mondja meg, hogy melyik kosárba
  tartozik a rekord, ha `x` volt az indexmező értéke a rekordban

<!-- Has link in it -->
## 20. Milyen probléma keletkezhet kiterjeszthető hasító index esetén és mi rá a megoldás? (2 pont)

-  Probléma:
- Ha az új sorok hasító értékének eleje sok bitben megegyezik, akkor hosszú
  ágak keletkezhetnek (nincs kiegyensúlyozva a fa).
- Megoldás:
  - A bináris gráfot teljessé is tehetjük. A gráfot egy tömbbel ábrázolhatjuk.
    Ekkor minden kosár azonos szinten lesz, de közös blokkjai is lehetnek a
    kosaraknak. Túlcsordulás esetén a kosarak száma duplázódik.
  - Ábráért ld. http://people.inf.elte.hu/kiss/13ab2osz/fizika.ppt 14. dia


<!-- Type of code it has to be shown the same way as in the .md file-->
## 43. Egy példa alapján szemléltessük a köztes csúcs jellemzőit B+-fa index esetén! (8 pont)

- Köztes (nem-levél) csúcs szerkezete:

```text
     ┌───────────────────────────┐  
     │                           │  
     │                           │  
  ┌╶╶╶╶ 57╶╶╶╶┐    81╶╶╶┐    95╶╶╶╶┐
  ╎  │        ╎         ╎        │ ╎  
  ╎  │        ╎         ╎        │ ╎  
  ╎  └────────╎─────────╎────────┘ ╎  n+1 mutató
  ↓           ↓         ╎          ╎  n indexérték
k < 57   57 ≤ k < 81    ╎          ╎  
                        ╎          ╎  
                        ↓          ╎  
                   81 ≤ k < 95     ╎  
                                   ╎  
                                   ↓  
                                95 ≤ k  
```

<!-- Has pictures -->
## 45. Mutassunk példát, mikor beszúráskor egy levélcsúcsot kettéosztunk B+-fa index esetén! (5 pont)


![45. kérdés, fizika.ppt, 53. dia](./images/45.png)


<!-- SQL code and picture -->
## 51. Mutassunk példát arra, mikor logikai feltételek kiértékelését bitmap vektorműveletekre vezetjük vissza! (7 pont)

```sql
SELECT COUNT(*)
FROM CUSTOMER
WHERE MARITAL_STATUS = 'married' AND
  REGION IN ('central', 'west');
```

![51. kérdés, 08-indexek-1.ppt, 34. dia](./images/51.png)

<!-- Table -->
## 77. Mutassunk példát, hogy a kivonás és a vetítés nem felcserélhető! (2 pont)

- &Pi;<sub>A</sub>(E1 - E2) ~= &Pi;<sub>A1</sub>(E1) - &Pi;<sub>A2</sub>(E2)
- E1:

  | A | B |
  | - | - |
  | 0 | 0 |
  | 0 | 1 |

- E2:

  | A | B |
  | - | - |
  | 0 | 0 |

- &Pi;<sub>A</sub>(E1 - E2) =

  | A |
  | - |
  | 0 |

- &Pi;<sub>A1</sub>(E1) - &Pi;<sub>A2</sub>(E2) = &empty;

<!-- <code> -->
## 129. 5 tagú összekapcsolás sorrendjének legjobb tervét dinamikus programozási elvet alkalmazva hogyan számoljuk ki? (3 pont)

```
nBestPlan(A,B,C,D,E) = min of (
BestPlan(A,B,C,D) |X| E,
BestPlan(A,B,C,E) |X| D,
BestPlan(A,B,D,E) |X| C,
BestPlan(A,C,D,E) |X| B,
BestPlan(B,C,D,E) |X| A )
```

## 199. Az `r1(A); w1(A); r2(A); w2(A); r1(B); w1(B); r2(B); w2(B);` ütemezést alakítsuk soros ütemezéssé (5 pont)

1. `r1(A); w1(A); r2(A); w2(A); r1(B); w1(B); r2(B); w2(B);`
2. `r1(A); w1(A); r2(A); r1(B); w2(A); w1(B); r2(B); w2(B);`
3. `r1(A); w1(A); r1(B); r2(A); w2(A); w1(B); r2(B); w2(B);`
4. `r1(A); w1(A); r1(B); r2(A); w1(B); w2(A); r2(B); w2(B);`
5. `r1(A); w1(A); r1(B); w1(B); r2(A); w2(A); r2(B); w2(B);`


## 209. Mi jellemző az aktív ütemezésre és milyen 3 módszert lehet erre használni? (5 pont)

Aktív módszer: az ütemező beavatkozik, és megakadályozza, hogy kör alakuljon ki

1. Zárak (ezen belül is még: protokoll elemek, pl. 2PL)
2. Időbélyegek (time stamp)
3. Érvényesítés
