export const CREATE_ROBOT_FROM_DESCRIPTION_PROMPT = (description) => `
Jesteś expertem od tworzenia grafiki na podstawie opisu.
NA PODSTAWIE PODANEGO OPISU STWÓRZ SZCZEGÓŁOWO GRAFIKĘ ROBOTA.

<WYMAGANIA>
Chciałbym abyś zadbał o kady detal tworząc tą grafikę.
Grafika powinna być w formacie PNG.
Grafika powinna być wielkości 1024x1024px.
</WYMAGANIA>

Opis:
${description}
`;
