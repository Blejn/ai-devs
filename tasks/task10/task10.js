import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { openai } from "../../utils/openai.js";
import { writeFile, readFile } from "fs/promises";
import TurndownService from "turndown";
import { convertHtmlToMarkdown } from "../../prompts/prompt_task10.js";
import fs from "fs";

dotenv.config();

const SEND_REPORT_API = `${process.env.API_URL}/report`;
const QuestionsLink = `https://centrala.ag3nts.org/data/${process.env.API_KEY}/arxiv.txt`;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const URL_WEBSITE = "https://centrala.ag3nts.org/dane/arxiv-draft.html";
const URL_FOR_FILES = "https://centrala.ag3nts.org/dane/";

const turndownService = new TurndownService();

const getQuestions = async () => {
  try {
    const response = await fetch(QuestionsLink);
    const data = await response.text();
    return data;
  } catch (error) {
    console.error(error);
  }
};

const getMarkdownOfUrl = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.text();
    const markdown = turndownService.turndown(data);
    await writeFile(join(__dirname, "website.md"), markdown, "utf8");
  } catch (writeError) {
    console.error("Nie udało się zapisać pliku:", writeError);
  }
  return response;
};

export const AnserTheQuestions = async () => {
  try {
    const questions = await getQuestions();
    console.log("questions", questions);
    const markdown = await readFile(join(__dirname, "website.md"), "utf8");
    const processedMarkdown = await analyzeMp3AndPngFiles(markdown);
    const answer = await analyzeMarkdown(processedMarkdown, questions);
    const jsonAnswer = JSON.parse(answer);
    console.log("answer", answer);
    console.log("jsonAnswer", jsonAnswer);
    const report = await sendReport(jsonAnswer);
    console.log("report", report);
    console.log("questions", questions);
  } catch (error) {
    console.error(error);
  }
};

const analyzeMarkdown = async (markdown, questions) => {
  try {
    const prompt = convertHtmlToMarkdown(questions);
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: markdown },
      ],
    });

    const content = response.choices[0].message.content;

    return content;
  } catch (error) {
    console.error("Error parsing response:", error);
    console.error("Raw content:", response.choices[0].message.content);
  }
};
const sendReport = async (result) => {
  try {
    const requestAnswer = {
      task: "arxiv",
      apikey: process.env.API_KEY,
      answer: result,
    };

    const response = await fetch(SEND_REPORT_API, {
      method: "POST",
      body: JSON.stringify(requestAnswer),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log("data", data);
    return data;
  } catch (error) {
    console.error(error);
  }
};

const analyzeMp3AndPngFiles = async (markdown) => {
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const mp3Regex = /\[([^\]]*\.mp3[^\]]*)\]\(([^)]+\.mp3[^)]*)\)/g;

  const imageMatches = [...markdown.matchAll(imageRegex)];
  const mp3Matches = [...markdown.matchAll(mp3Regex)];

  for (const match of imageMatches) {
    const fullMatch = match[0];
    const imageUrl = match[2];

    console.log("Processing image:", imageUrl);
    const analysis = await analyzeImage(imageUrl);

    markdown = markdown.replace(
      fullMatch,
      `**[IMAGE]** ${analysis} **[/IMAGE]**`
    );
  }

  for (const match of mp3Matches) {
    const fullMatch = match[0];
    const audioUrl = match[2];

    console.log("Processing audio:", audioUrl);
    const transcript = await getTranscript(audioUrl);

    markdown = markdown.replace(
      fullMatch,
      `**[AUDIO]** ${transcript} **[/AUDIO]**`
    );
  }

  console.log("processedMarkdown", markdown);
  return markdown;
};

const getTranscript = async (mp3Url) => {
  try {
    const audioFile = await fetch(mp3Url);
    const arrayBuffer = await audioFile.arrayBuffer();

    const tempPath = join(__dirname, "temp_audio.mp3");
    fs.writeFileSync(tempPath, Buffer.from(arrayBuffer));

    console.log("tempPath", tempPath);
    const response = await openai.audio.transcriptions.create({
      model: "whisper-1",
      file: fs.createReadStream(tempPath),
      response_format: "text",
    });
    fs.unlinkSync(tempPath);
    console.log("transcript", response);
    return response;
  } catch (error) {
    console.error("Error in getTranscript:", error);
    return "Błąd transkrypcji audio";
  }
};

const analyzeImage = async (imageUrl) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "Opisz szczegółowo co widzisz na obrazie, przeczytaj cały tekst, oraz dokładnie opisz co widzisz na obrazie szczegółowo opis ma byc po polsku",
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: imageUrl },
            },
          ],
        },
      ],
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error(error);
  }
};
