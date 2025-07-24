export const answerTheQuestionPrompt = `
Your task is to find all names, cities, streets and ages in the following Polish sentence and replace them with the word BANAN.

Do not change the structure, punctuation, or anything else in the sentence.

Return only the modified sentence.

Example:
Input: Adam Nowak mieszka w Warszawie przy ul. Pięknej 10. Ma 32 lata.
Output: BANAN mieszka w BANAN przy ul. BANAN. Ma BANAN lata.

Now process:
Dane osoby: Wojciech Górski. Mieszka w Lublinie, ul. Akacjowa 7. Wiek: 27 lat.
`;
