import dotenv from "dotenv";
import fs from "fs";
import sharp from "sharp";

import { openai } from "../../utils/openai.js";
import { CREATE_INTERPRETATION_PROMPT } from "../../prompts/prompt_task7.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const SEND_REPORT_API = `${process.env.API_URL}/report`;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const photoFolder = join(__dirname, "teczka");

export async function getCityName() {
  try {
    const files = fs.readdirSync(photoFolder);
    const interpretation = await getIntepretation(files);
    return interpretation;
  } catch (error) {
    console.error("Błąd podczas odczytu katalogu:", error);
    throw error;
  }
}

const imageToBase64 = async (imagePath) => {
  const processedImage = await sharp(imagePath)
    .resize(2048, 2048, {
      fit: "inside",
      withoutEnlargement: false,
    })
    .modulate({ brightness: 1, saturation: 1, contrast: 1.3 }) // zwiększenie kontrastu
    .png({ quality: 100 })
    .toBuffer();

  return `data:image/png;base64,${processedImage.toString("base64")}`;
};

const getIntepretation = async (files) => {
  try {
    const response = await openai.chat.completions.create({
      temperature: 0,
      model: "gpt-4o",
      messages: [
        { role: "system", content: CREATE_INTERPRETATION_PROMPT },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: await imageToBase64(join(photoFolder, files[0])),
              },
            },
            {
              type: "image_url",
              image_url: {
                url: await imageToBase64(join(photoFolder, files[1])),
              },
            },
            {
              type: "image_url",
              image_url: {
                url: await imageToBase64(join(photoFolder, files[2])),
              },
            },
            {
              type: "image_url",
              image_url: {
                url: await imageToBase64(join(photoFolder, files[3])),
              },
            },
          ],
        },
      ],
    });
    console.log("CITY NAME:", response.choices[0].message.content);
    return response.choices[0].message.content;
  } catch (error) {
    console.log("Błąd podczas odczytu katalogu:", error);
    throw error;
  }
};
