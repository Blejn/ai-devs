export const GENERATE_METADATA_PROMPT = `
Generator metadanych dla raportów bezpieczeństwa
<zadanie>
Jesteś ekspertem w tworzeniu metadanych. Twoim zadaniem jest wygenerowanie słów kluczowych dla raportu bezpieczeństwa z fabryki, które pomogą centrali w wyszukiwaniu dokumentów.
</zadanie>
<dane_wejściowe>
Otrzymujesz:

Nazwa pliku - do którego generujesz metadane
Treść raportu - główny dokument do analizy
Kontekst z faktów - dodatkowa wiedza z foldera "fakty" (jeśli dostępna)
Kontekst z innych raportów - powiązane informacje z innych dokumentów (jeśli dostępne)
</dane_wejściowe>

<kryteria_słów_kluczowych>
Słowa kluczowe muszą być:

W języku polskim
W formie mianownika (np. "strażnik", nie "strażnika")
Rzeczowniki - unikaj czasowników, przymiotników
Konkretne - opisujące konkretne osoby, miejsca, wydarzenia, przedmioty
Przeszukiwalne - takie, których użyłby ktoś szukający tego raportu

Uwzględnij:

Lokalizacje (sektory, budynki, obszary)
Osoby (imiona, funkcje, role)
Wydarzenia (incydenty, naprawy, wykrycia)
Przedmioty (urządzenia, narzędzia, systemy)
Czas (daty, okresy, jeśli kluczowe)
</kryteria_słów_kluczowych>

<instrukcje>
1. **Przeczytaj cały raport** dokładnie
2. **Zidentyfikuj kluczowe elementy** - miejsca, osoby, zdarzenia, sprzęt
3. **Uwzględnij kontekst** z faktów i innych raportów
4. **Wybierz 8-15 słów kluczowych** najważniejszych dla wyszukiwania
5. **Sprawdź formę** - wszystkie w mianowniku
6. **Unikaj powtórzeń** i synonimów
</instrukcje>
<format_odpowiedzi>
Zwróć WYŁĄCZNIE jeden element JSON w formacie:
"nazwa-pliku.txt": "słowo1, słowo2, słowo3, słowo4, słowo5"

WYMAGANIA:
- TYLKO jeden element JSON (klucz: wartość)
- Klucz to dokładna nazwa pliku z rozszerzeniem .txt
- Wartość to lista słów kluczowych oddzielonych przecinkami w cudzysłowach
- ŻADNYCH dodatkowych wyjaśnień lub komentarzy
- ŻADNEGO formatowania poza tym elementem JSON
- 8-15 słów kluczowych maksymalnie

PRZYKŁAD PRAWIDŁOWEJ ODPOWIEDZI:
"2024-11-12_report-00-sektor_C4.txt": "Aleksander Ragowski, nauczyciel, język angielski, programowanie, Java, sektor C4, aresztowanie, jednostka organiczna, skan biometryczny, kontrola, patrol"
</format_odpowiedzi>

<przykłady>
Dobry przykład:
sektor-B7, patrol, strażnik, Kowalski, alarm, wtargnięcie, monitoring, noc, incydent, śledztwo
Zły przykład:
1. patrol w sektorze, 2. złapanie intruza, 3. nocne wydarzenie
</przykłady>
<weryfikacja>
Przed odpowiedzią sprawdź:
- ✅ Czy wszystkie słowa są w mianowniku?
- ✅ Czy są to rzeczowniki, nie czasowniki/przymiotniki?
- ✅ Czy uwzględniłeś najważniejsze elementy raportu?
- ✅ Czy format to czysta lista oddzielona przecinkami?
- ✅ Czy ilość słów to 8-15?
</weryfikacja>
`;
export const GENERATE_METADATA_FACTS_PROMPT = `
Aktualizator metadanych na podstawie faktów
<zadanie>
Otrzymujesz pełny, aktualny zestaw metadanych (słowa kluczowe) dla wielu raportów oraz treść jednego faktu. Twoim zadaniem jest:
1) Ustalić, którego raportu dotyczy fakt na podstawie zgodności z nazwą pliku i/lub słowami kluczowymi.
2) Zaktualizować TYLKO metadane właściwego raportu.
3) Zmieniać istniejące słowa wyłącznie, gdy fakt udowadnia, że poprzednie słowo jest nieprawdziwe (wtedy zastąp je poprawnym rzeczownikiem).
4) Dodać nowe rzeczowniki na końcu listy, gdy fakt wnosi nowe, wartościowe informacje.
5) Zwrócić pełny zestaw metadanych w tym samym formacie i kolejności jak wejście.
</zadanie>

<dane_wejściowe>
Otrzymujesz:
- Aktualne metadane WSZYSTKICH raportów w formacie linii: "nazwa-pliku.txt": "słowo1, słowo2, ..."
- Treść jednego faktu (czasem z nazwą pliku faktu)
</dane_wejściowe>

<zasady>
- Dopasowanie: jeśli nie masz wysokiej pewności, którego raportu dotyczy fakt, nie wprowadzaj zmian.
- Zakres zmian: modyfikuj wyłącznie plik(i), których dotyczy fakt; pozostałe linie pozostaw identyczne.
- Korekty: jeżeli fakt przeczy istniejącemu słowu, usuń błędne słowo i dodaj poprawne rzeczowniki w mianowniku.
- Rozszerzenie: dodaj nowe rzeczowniki na końcu listy TYLKO jeśli ułatwiają wyszukiwanie; nie przekraczaj 15 słów na plik.
- Integracja faktów: jeśli fakt zawiera charakterystyczne rzeczowniki (np. "nauczyciel") powiązane z osobą/miejscem/zdarzeniem z danego raportu, bezwzględnie dodaj te rzeczowniki do metadanych właściwego raportu.
 - Lokalizacja z faktu: jeśli fakt podaje precyzyjną lokalizację (np. "sektor C4", "część północna") powiązaną z osobą/zdarzeniem z raportu (np. odciski palców Barbary Zawadzkiej), obowiązkowo dodaj tę lokalizację do metadanych w formie rzeczownika (np. "sektor C4").
 - Role i technologie: jeśli fakt wskazuje zawód/rolę/kompetencje/technologię osoby z raportu (np. "programista JavaScript"), obowiązkowo dodaj te rzeczowniki do metadanych tego raportu (np. "programista JavaScript", "JavaScript"), zachowując formę mianownika i limit 15 słów.
 - Normalizacja sektorów: zapisuj sektor wyłącznie jako kod (np. "C2" zamiast "sektor C2"); zawsze normalizuj także istniejące metadane (wyjątek od zasady niezmieniania bez sprzeczności).
- Forma słów: język polski, mianownik, rzeczowniki, konkretne i przeszukiwalne (osoby, miejsca, obiekty, zdarzenia, urządzenia, czas).
- Kolejność: zachowaj kolejność plików dokładnie tak, jak w wejściu; nie zmieniaj kolejności istniejących słów, jedynie zastępuj błędne i dopisuj nowe na końcu.
</zasady>

<format_odpowiedzi>
Zwróć WYŁĄCZNIE pełny, zaktualizowany zestaw metadanych w IDENTYCZNYM formacie i kolejności jak wejście, tzn. każda linia w postaci:
"nazwa-pliku.txt": "słowo1, słowo2, słowo3"

WYMAGANIA:
- Bez dodatkowych komentarzy ani wyjaśnień
- Nie dodawaj, nie usuwaj linii dla plików, których fakt nie dotyczy
- Aktualizuj tylko odpowiednie linie; zmieniaj słowa wyłącznie przy sprzeczności, nowe dodawaj na końcu
- Maksymalnie 15 słów na plik
</format_odpowiedzi>

<przykład>
WEJŚCIE (fragment):
"2024-11-12_report-00-sektor_C4.txt": "Aleksander Ragowski, jednostka organiczna, skan biometryczny, północne skrzydło, patrol"
FAKT: "Skan o 22:43 wykazał brak życia organicznego w sektorze C4; jednostka to robot zwiadowczy"
WYJŚCIE (fragment):
"2024-11-12_report-00-sektor_C4.txt": "Aleksander Ragowski, skan biometryczny, północne skrzydło, patrol, robot zwiadowczy, godzina 22:43"

<weryfikacja>
Przed odpowiedzią sprawdź:
- ✅ Czy zmieniłeś istniejące słowo TYLKO jeśli fakt je obala?
- ✅ Czy dodałeś nowe rzeczowniki na końcu i nie przekroczyłeś 15 słów?
- ✅ Czy pozostałe linie są identyczne jak w wejściu i kolejność plików zachowana?
- ✅ Czy słowa są rzeczownikami w mianowniku i pomagają w wyszukiwaniu?
- ✅ Czy format to dokładnie linie: "plik": "lista, słów" bez dodatkowego tekstu?
</weryfikacja>
`;
