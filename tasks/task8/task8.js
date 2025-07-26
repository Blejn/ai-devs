import dotenv from "dotenv";
import { openai } from "../../utils/openai.js";

const SEND_REPORT_API = `${process.env.API_URL}/report`;
const DESCRIPTION_URL =
  "https://centrala.ag3nts.org/data/5e8cc6c9-8828-4d19-9bd3-83fdbc189fa9/robotid.json";

async function getDescription() {
  const response = await fetch(DESCRIPTION_URL);
  const data = await response.json();
  return data.description;
}

export const sendReport = async () => {
  const description = await getDescription();
  const imageUrl = await generateImage(description);
  const image = await sendImage(imageUrl);

  console.log("image", image);
};

const generateImage = async (description) => {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: description,
    });
    return response.data[0].url;
  } catch (error) {
    console.error(error);
  }
};

const sendImage = async (imageUrl) => {
  try {
    const requestAnswer = {
      task: "robotid",
      apikey: process.env.API_KEY,
      answer: imageUrl,
    };

    console.log("Wysyłam request:", requestAnswer);
    console.log("URL:", SEND_REPORT_API);

    const response = await fetch(SEND_REPORT_API, {
      method: "POST",
      body: JSON.stringify(requestAnswer),
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);

    // Sprawdź czy response jest OK
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, body: ${errorText}`
      );
    }

    // Sprawdź content-type przed parsowaniem JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const responseText = await response.text();
      console.error("Expected JSON but got:", contentType);
      console.error("Response body:", responseText);
      throw new Error(`Expected JSON response but got ${contentType}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error in sendImage:", error);
    throw error; // Re-throw żeby zobaczyć pełny błąd
  }
};
