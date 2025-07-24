import dotenv from "dotenv";
import fs from "fs";
import { openai } from "../../utils/openai.js";
import { CREATE_COMMON_CONTEXT_PROMPT } from "../../prompts/prompt_task6.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const TASK_API = `${process.env.API_URL}/data/${process.env.API_KEY}/report.txt`;
const SEND_REPORT_API = `${process.env.API_URL}/report`;

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const audioFolder = join(__dirname, "przesluchania");

const sendReport = async (answer) => {
  try {
    const requestAnswer = {
      task: "mp3",
      apikey: process.env.API_KEY,
      answer: answer,
    };

    const response = await fetch(SEND_REPORT_API, {
      method: "POST",
      body: JSON.stringify(requestAnswer),
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.json();
  } catch (error) {
    console.error("Błąd w sendReport:", error);
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

export async function getFiles() {
  const transcript = [];
  try {
    const files = fs.readdirSync(audioFolder);
    for (const file of files) {
      console.log(file);
      const result = await getTranscript(file);
      transcript.push(result);
    }
    const answer = await createCommonContext(transcript.join(","));
    const result = await sendReport(answer);
    console.log("Result: ", result);
    return result;
  } catch (error) {
    console.error("Błąd podczas odczytu katalogu:", error);
    throw error;
  }
}

const getTranscript = async (file) => {
  try {
    const response = await openai.audio.transcriptions.create({
      model: "whisper-1",
      file: fs.createReadStream(join(audioFolder, file)),
      response_format: "text",
    });
    const answer = response;
    return answer;
  } catch (error) {
    console.error("Błąd podczas transkrybowania pliku:", error);
    throw error;
  }
};

const createCommonContext = async (transcript) => {
  const responseAboutContext = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: CREATE_COMMON_CONTEXT_PROMPT },
      { role: "user", content: transcript },
    ],
  });
  const answer = responseAboutContext.choices[0].message.content;
  return answer;
};
