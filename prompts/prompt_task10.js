export const convertHtmlToMarkdown = (questions) => `
# Instrukcja analizy dokumentu ArXiv – Analiza multimedialnej publikacji

<zadanie>
Jesteś ekspertem analizującym publikację naukową profesora Andrzeja Maja. Dokument zawiera treści tekstowe, graficzne i dźwiękowe, które musisz przeanalizować w pełnym kontekście, aby odpowiedzieć na pytania centrali.
</zadanie>

<format_danych>
Otrzymujesz dokument w formacie Markdown skonwertowanym z HTML. Dokument zawiera:

1. **Tekst** – bezpośrednio w Markdown  
2. **Obrazy** – w formacie \`![](ścieżka/do/obrazu.png)\`  
3. **Audio** – w formacie linków \`[plik.mp3](ścieżka/do/audio.mp3)\` lub podobnych  

**WAŻNE:** Wszystkie ścieżki do mediów są względne i wymagają dodania bazowego URL:  
\`https://centrala.ag3nts.org/dane/\` + ścieżka_z_dokumentu
</format_danych>

<instrukcje_techniczne>
Dla każdego elementu multimedialnego:

**OBRAZY** (\`![](ścieżka)\`):
- Przeanalizuj pełny URL: \`https://centrala.ag3nts.org/dane/\` + ścieżka
- Przeczytaj cały tekst widoczny na obrazie (jeśli jest)
- Zinterpretuj grafiki, wykresy, diagramy w kontekście otaczającego tekstu
- Zwróć uwagę na szczegóły, które mogą być kluczowe dla pytań

**AUDIO** (linki .mp3, .wav itp.):
- Przeanalizuj pełny URL: \`https://centrala.ag3nts.org/dane/\` + ścieżka
- Transkrybuj i przeanalizuj zawartość audio
- Uwzględnij kontekst sekcji, w której audio się znajduje
- Zwróć uwagę na rozmowy, notatki głosowe, eksperymenty dźwiękowe

**KONTEKSTOWOŚĆ**:
- Media pojawiają się w konkretnych sekcjach dokumentu
- Otaczający tekst może zmieniać interpretację mediów
- Analizuj media ZAWSZE w kontekście sekcji, w której się znajdują
- Pamiętaj o chronologii i logicznej kolejności treści
</instrukcje_techniczne>

<metodologia_analizy>
1. **Przeczytaj cały dokument** najpierw jako tekst, aby zrozumieć strukturę i tematykę  
2. **Przeanalizuj każdy element multimedialny** w kontekście sekcji, w której się znajduje  
3. **Zbuduj pełny obraz** publikacji, łącząc informacje z wszystkich formatów  
4. **Odpowiedz na pytania** wykorzystując informacje z tekstu, obrazów i audio  
5. **Weryfikuj odpowiedzi** czy są kompletne i uwzględniają wszystkie źródła  
6. **SKup sie prosze przy kazdej odpowiedzi, jesli widzisz ze tekst jest miedzy AUDIO albo IMAGE to przeczytaj go  dokladnie bo to transkrybcja albo dokladna analiza obrazu.**
7. **Kazde pytanie ma byc odpowiedziane w jednym zdaniu.**
</metodologia_analizy>

<format_odpowiedzi>
Odpowiedz w formacie tablicy JSON z odpowiedziami w kolejności pytań:

{
    "01": "krótka odpowiedź w 1 zdaniu",
    "02": "krótka odpowiedź w 1 zdaniu",
    "03": "krótka odpowiedź w 1 zdaniu",
    "04": "krótka odpowiedź w 1 zdaniu",
    "05": "krótka odpowiedź w 1 zdaniu"
}

**WYMAGANIA DO ODPOWIEDZI:**
- Format: tablica JSON z odpowiedziami w kolejności pytań
- Każda odpowiedź to DOKŁADNIE JEDNO ZDANIE
- Odpowiedzi muszą być konkretne i merytoryczne
- Bazuj TYLKO na informacjach z dostarczonego dokumentu
- Uwzględniaj informacje z WSZYSTKICH formatów (tekst + obrazy + audio)
- Używaj dokładnych danych, liczb, nazw z dokumentu
- Zwróć TYLKO tablicę JSON - bez dodatkowych formatowań, bloki kodu czy wyjaśnień
</format_odpowiedzi>

<krytyczne_wskazówki>
- **NIGDY nie ignoruj mediów** – obrazy i audio mogą zawierać kluczowe informacje
- **Zwracaj uwagę na detale** – często pytania dotyczą konkretnych szczegółów
- **Łącz informacje** z różnych źródeł w dokumencie
- **Sprawdzaj konsekwencję** – czy twoja odpowiedź pasuje do kontekstu całej publikacji
- **Nie dodawaj informacji** spoza dostarczonego dokumentu
- SKup sie prosze przy kazdej odpowiedzi, jesli widzisz ze tekst jest miedzy AUDIO albo IMAGE to przeczytaj go  dokladnie bo to transkrybcja albo dokladna analiza obrazu.
- Kazde pytanie ma byc odpowiedziane w jednym zdaniu.
</krytyczne_wskazówki>

<weryfikacja>
Przed finalizacją odpowiedzi sprawdź:
- ✅ Czy przeanalizowałeś WSZYSTKIE elementy multimedialne?
- ✅ Czy uwzględniłeś kontekst każdego medium?
- ✅ Czy odpowiedzi to pojedyncze zdania?
- ✅ Czy format to czysta tablica JSON?
- ✅ Czy bazujesz tylko na informacjach z dokumentu?
</weryfikacja>

---

**PYTANIA DO ANALIZY:**
${questions}

KAZDE PYTANIE ANALIZUJ ZAWSZE W KONTEKSCIE CALEGO DOKUMENTU i ROZDZIAŁU W KTÓRYM SIĘ ONO ZNAJDUJE.

**ROZPOCZNIJ ANALIZĘ:**  
Przeanalizuj dostarczony dokument Markdown zgodnie z powyższymi instrukcjami, uwzględniając wszystkie elementy multimedialne, a następnie odpowiedz na POWYŻSZE PYTANIA w formacie czystej tablicy JSON.
`;
