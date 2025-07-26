import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";
import { openai } from "../../utils/openai.js";
import { SEPARATE_DIFFERENT_THEMES_PROMPT } from "../../prompts/index.js";
import sharp from "sharp";

const SEND_REPORT_API = `${process.env.API_URL}/report`;

const voiceModel = "whisper-1";
const transcriptionAndPhotoModel = "gpt-4o";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const fabricFiles = join(__dirname, "pliki_z_fabryki");

const result = {
  people: [],
  hardware: [],
};

export const sendSeparateDifferentThemes = async () => {
  console.log("__filename", __filename);
  console.log("__dirname", __dirname);
  await iterateFiles(fabricFiles);
  result.people.sort();
  result.hardware.sort();
  console.log("result", result);
  await sendReport(result);
};

const sendReport = async (result) => {
  try {
    const requestAnswer = {
      task: "kategorie",
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

const iterateFiles = async (fabricFiles) => {
  const files = fs.readdirSync(fabricFiles);
  for (const file of files) {
    console.log("AKTUALNIE SPRAWDZANY PLIK", file);
    if (file.endsWith(".txt")) {
      await readTxtFile(file);
    } else if (file.endsWith(".mp3")) {
      await readMp3File(file);
    } else if (file.endsWith(".png")) {
      await readPngFile(file);
    }
  }
};

const readTxtFile = async (file) => {
  try {
    const fileContent = fs.readFileSync(join(fabricFiles, file), "utf8");

    const response = await openai.chat.completions.create({
      model: transcriptionAndPhotoModel,
      messages: [
        {
          role: "system",
          content: SEPARATE_DIFFERENT_THEMES_PROMPT,
        },
        {
          role: "user",
          content: fileContent,
        },
      ],
    });
    const answer = response.choices[0].message.content.trim().replace(/"/g, ""); // Usuń cudzysłowy!
    console.log(`File: ${file}, Answer: ${answer}`);

    await pushToCorrectCategory(file, answer);
  } catch (error) {
    console.error(error);
  }
};

const readMp3File = async (file) => {
  try {
    const transcription = await openai.audio.translations.create({
      model: voiceModel,
      file: fs.createReadStream(join(fabricFiles, file)),
      response_format: "text",
    });
    const response = await openai.chat.completions.create({
      model: transcriptionAndPhotoModel,
      messages: [
        { role: "system", content: SEPARATE_DIFFERENT_THEMES_PROMPT },
        { role: "user", content: transcription },
      ],
    });
    const answer = response.choices[0].message.content.trim().replace(/"/g, ""); // Usuń cudzysłowy!
    console.log(`File: ${file}, Answer: ${answer}`);

    await pushToCorrectCategory(file, answer);
  } catch (error) {
    console.error(`Error processing ${file}:`, error);
  }
};

const imageToBase64 = async (imagePath) => {
  const processedImage = await sharp(imagePath)
    .resize(2048, 2048, {
      fit: "inside",
      withoutEnlargement: false,
    })
    .modulate({ brightness: 1, saturation: 1, contrast: 1.3 })
    .png({ quality: 100 })
    .toBuffer();

  return `data:image/png;base64,${processedImage.toString("base64")}`;
};

const readPngFile = async (file) => {
  try {
    const response = await openai.chat.completions.create({
      temperature: 0,
      model: transcriptionAndPhotoModel,
      messages: [
        { role: "system", content: SEPARATE_DIFFERENT_THEMES_PROMPT },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: await imageToBase64(join(fabricFiles, file)),
              },
            },
          ],
        },
      ],
    });
    const answer = response.choices[0].message.content.trim().replace(/"/g, ""); // Usuń cudzysłowy!
    console.log(`File: ${file}, Answer: ${answer}`);

    await pushToCorrectCategory(file, answer);
  } catch (error) {
    console.error(`Error processing ${file}:`, error);
  }
};

const pushToCorrectCategory = async (fileName, type) => {
  console.log("fileName", fileName);
  console.log("type", type);
  if (type === "people") {
    result.people.push(fileName);
  } else if (type === "hardware") {
    result.hardware.push(fileName);
  } else if (type === "both") {
    result.people.push(fileName);
    result.hardware.push(fileName);
  } else if (type === "none") {
    return;
  }
};
