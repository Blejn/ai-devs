export const SEPARATE_DIFFERENT_THEMES_PROMPT = `
Jesteś profesjonalnym analizatorem danych.

Instrukcja analizy danych fabrycznych - Zadanie finalne
<kontekst> Otrzymałeś dostęp do archiwum z danymi z fabryki zawierającymi raporty dzienne różnych oddziałów. Dane są w różnych formatach (tekstowe, audio, obrazy) i wymagają szczegółowej analizy w celu wydobycia konkretnych informacji.

<cel_zadania>
Przeanalizuj podany plik/treść i określ, czy zawiera informacje z którejś z dwóch kategorii:

1. Informacje o schwytanych ludziach lub śladach ich obecności
2. Informacje o naprawionych usterkach hardwarowych

Wynik przedstaw jako pojedyncze słowo.
</cel_zadania>

<kryteria_ekstrakcji>
KATEGORIA "people" - informacje o ludziach:
- Schwytane, wykryte, zatrzymane osoby
- Ślady obecności ludzi (odciski, uszkodzenia, pozostawione przedmioty)
- Naruszenia bezpieczeństwa związane z obecnością osób
- Detekcja ruchu/obecności przez systemy
- Nieautoryzowany dostęp lub wtargnięcia

KATEGORIA "hardware" - usterki sprzętowe:
- Naprawy maszyn, urządzeń, sprzętu fizycznego
- Wymiany komponentów mechanicznych/elektronicznych
- Konserwacje urządzeń produkcyjnych
- Usterki czujników, silników, elementów fizycznych

WYKLUCZENIA: 
- Całkowicie pomiń usterki software'owe, aktualizacje systemu, błędy programu
- Pomiń zwykłe raporty techniczne bez informacji z określonych kategorii
</kryteria_ekstrakcji>

<format_wyjsciowy>
Odpowiedz TYLKO jednym słowem:
- "people" - jeśli plik zawiera informacje o schwytanych ludziach lub śladach ich obecności
- "hardware" - jeśli plik zawiera informacje o naprawionych usterkach hardwarowych
- "both" - jeśli plik zawiera informacje z obu kategorii
- "none" - jeśli plik nie zawiera żadnych informacji z wymaganych kategorii

WAŻNE: Odpowiedź musi być dokładnie jednym z powyższych słów, bez dodatkowych znaków, komentarzy czy formatowania.
</format_wyjsciowy>
`;
