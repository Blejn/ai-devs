import dotenv from "dotenv";
import { openai } from "../../utils/openai.js";
import { censorshipPrompt } from "../../prompts/prompt_task5.js";
dotenv.config();

const TASK_API = `${process.env.API_URL}/data/${process.env.API_KEY}/cenzura.txt`;
const GET_REPORT_API = `${process.env.LOCAL_HOST}:${process.env.LOCAL_PORT}/api/generate`;
const SEND_REPORT_API = `${process.env.API_URL}/report`;

const getJsonFile = async () => {
  const response = await fetch(TASK_API);
  const json = await response.text();
  console.log(json);
  return json;
};

export const censorship = async (req, res) => {
  const text_to_censor = await getJsonFile();
  console.log("Text to censor:", text_to_censor);
  const report = await getCensoredText(text_to_censor);
  console.log("Report:", report);
  const answer = await sendReport(report);
  console.log("Answer:", answer);
  res.json({ report, answer });
};

export const getCensoredText = async (text_to_censor) => {
  try {
    const answerResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // albo "gpt-4", jeśli masz dostęp
      messages: [
        {
          role: "system",
          content: censorshipPrompt,
        },
        {
          role: "user",
          content: text_to_censor,
        },
      ],
    });

    const answer = answerResponse.choices[0].message.content;
    return answer;
  } catch (error) {
    console.error("Błąd w getCensoredText:", error);
    return null;
  }
};
const sendReport = async (jsonFile) => {
  try {
    // Próbujemy sparsować odpowiedź jako JSON
    const parsedResponse = JSON.parse(jsonFile);
    parsedResponse["task"] = "CENZURA";
    parsedResponse["answer"] = parsedResponse.result;
    parsedResponse["apikey"] = process.env.API_KEY;
    console.log("parsedResponse", JSON.stringify(parsedResponse));

    // Wysyłamy tylko zawartość pola result
    const response = await fetch(SEND_REPORT_API, {
      method: "POST",
      body: JSON.stringify(parsedResponse), // Wysyłamy tylko tekst z pola result
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.json();
  } catch (error) {
    console.error("Błąd w sendReport:", error);
    // Jeśli nie udało się sparsować JSON, wysyłamy oryginalny tekst
    const response = await fetch(SEND_REPORT_API, {
      method: "POST",
      body: JSON.stringify(jsonFile),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.json();
  }
};
