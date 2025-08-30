import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { openai } from "../../utils/openai.js";
import fs from "fs";
import {
  GENERATE_METADATA_PROMPT,
  GENERATE_METADATA_FACTS_PROMPT,
} from "../../prompts/index.js";
const SEND_REPORT_API = `${process.env.API_URL}/report`;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const sendMetadataRaports = async () => {
  cleanFile();
  await readFiles();
  await sendReport();
};

const sendReport = async () => {
  const metadateAfterFactsFile = join(__dirname, "metadate-after-facts.txt");
  const metadateAfterFacts = fs.readFileSync(metadateAfterFactsFile, "utf-8");
  console.log("metadateAfterFacts", metadateAfterFacts);
  const answerObject = parseMetadataLinesToObject(metadateAfterFacts);
  const keys = Object.keys(answerObject);
  if (keys.length !== 10) {
    console.warn(
      `Ostrzeżenie: oczekiwano 10 elementów, wykryto ${keys.length}. Klucze:`,
      keys
    );
  }
  try {
    const requestAnswer = {
      task: "dokumenty",
      apikey: process.env.API_KEY,
      answer: answerObject,
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
  } catch (error) {
    console.error(error);
  }
};

function parseMetadataLinesToObject(content) {
  const result = {};
  const lines = content.split(/\r?\n/);
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;
    if (!line.startsWith('"')) continue;
    const sepIdx = line.indexOf('":');
    if (sepIdx <= 1) continue;
    const filename = line.slice(1, sepIdx);
    let valuePart = line.slice(sepIdx + 2).trim();
    if (valuePart.startsWith('"') && valuePart.endsWith('"')) {
      valuePart = valuePart.slice(1, -1).trim();
    }
    if (valuePart.endsWith(",")) {
      valuePart = valuePart.slice(0, -1).trim();
    }
    result[filename] = valuePart;
  }
  return result;
}

function cleanFile() {
  const file = join(__dirname, "metadate.txt");
  const fileAfterFacts = join(__dirname, "metadate-after-facts.txt");
  fs.writeFileSync(file, "");
  fs.writeFileSync(fileAfterFacts, "");
}
async function readFiles() {
  const metadateFile = join(__dirname, "metadate.txt");
  const metadateAfterFactsFile = join(__dirname, "metadate-after-facts.txt");
  const currentContent = fs.readFileSync(metadateFile, "utf-8").trim();
  const lastestContent = fs
    .readFileSync(metadateAfterFactsFile, "utf-8")
    .trim();

  const filesDir = join(__dirname, "files");
  const factsDir = join(__dirname, "files/facts");
  const filesContent = fs.readdirSync(filesDir);
  const factsFiles = fs.readdirSync(factsDir);

  if (currentContent === "") {
    for (const file of filesContent) {
      if (file.endsWith(".txt")) {
        const line = await generateMetadata(file);
        fs.appendFileSync(metadateFile, line + "\n");
      }
    }
  }

  if (lastestContent === "") {
    let latestMetadata = fs.readFileSync(metadateFile, "utf-8");
    for (const factFile of factsFiles) {
      if (!factFile.endsWith(".txt")) continue;
      const factPath = join(factsDir, factFile);
      const factContent = fs.readFileSync(factPath, "utf-8");
      const updated = await editMetadateAfterFacts(factFile, factContent);
      latestMetadata = updated;
      fs.writeFileSync(metadateFile, latestMetadata);
    }

    fs.writeFileSync(metadateAfterFactsFile, latestMetadata);
  }
}

async function generateMetadata(file) {
  try {
    const filePath = join(__dirname, "files", file);
    const userContent = fs.readFileSync(filePath, "utf-8");
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: GENERATE_METADATA_PROMPT,
        },
        {
          role: "user",
          content: `Nazwa pliku: ${file}\nTreść raportu:\n${userContent}`,
        },
      ],
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Błąd podczas generowania metadanych:", error);
    throw error;
  }
}

async function editMetadateAfterFacts(factFilename, factContent) {
  const metadataPath = join(__dirname, "metadate.txt");
  const metadataContent = fs.readFileSync(metadataPath, "utf-8");
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: GENERATE_METADATA_FACTS_PROMPT },
      {
        role: "user",
        content: `AKTUALNE METADANE:\n${metadataContent}\n\nFAKT (${factFilename}):\n${factContent}`,
      },
    ],
  });

  const updated = response.choices[0].message.content;
  console.log("Zaktualizowane metadane po fakcie", factFilename, "\n", updated);
  return updated;
}
