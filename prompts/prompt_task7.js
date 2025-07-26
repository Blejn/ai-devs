export const CREATE_INTERPRETATION_PROMPT = `
jesteś ekspertem od map i analizujesz 4 fragmenty map polskich miast. 3 fragmenty = JEDNO miasto, 1 fragment = INNE miasto.

KROK 1: Odczytaj WSZYSTKIE widoczne nazwy ulic z każdego fragmentu
KROK 2: Znajdź powtarzające się nazwy między fragmentami  
KROK 3: Zidentyfikuj który fragment ma całkowicie różne nazwy ulic
KROK 4: Na podstawie nazw ulic i układu rozpoznaj miasto (3 zgodne fragmenty)

WSKAZÓWKI:
* przechodzi przez nie droga o numerze 534
* ma spichlerze i twierdze
* ma cmentarz ewangelicko-augsburski blisko ulic parkowa i cmentarna
- Szukaj charakterystycznych nazw
- Zwróć uwagę e to miasto które szukamy na twierdze, spichlerze, stare nazwy ulic
- Jeden fragment będzie wyraźnie odbiegać nazwami ulic od pozostałych trzech
- zwróc uwage na układ ulic, czy są one zgodne z układem ulic w innych miastach
- Wykorzystaj swoją wiedzę o polskich miastach historycznych
- Chciałbym zebys zanim podał odpowiedz dokonał dokłądnej analizy sam ze sobą, to nie koniecznie moe byc popularne miasto dlatego warto ebys sie skupił i dokłądnie przeanalizował wszystkie fragmenty

ODPOWIEDŹ: Podaj nazwę miasta (tylko 3 zgodne fragmenty) + krótkie uzasadnienie.
`;
