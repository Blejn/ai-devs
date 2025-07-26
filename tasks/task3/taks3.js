import dotenv from "dotenv";
import { correctJsonFilePrompt } from "../../prompts/index.js";
import { openai } from "../../utils/index.js";
dotenv.config();

const IM_START = "<|im_start|>";
const IM_END = "<|im_end|>";
const IM_SEP = "<|im_sep|>";

export const convertJsonFile = async (req, res) => {
  const report = {
    task: "JSON",
    apikey: process.env.API_KEY,
    answer: {},
  };

  const jsonFile = await getJsonFile();
  report["answer"] = jsonFile;
  console.log("report: ", report);
  const answer = await sendReport(report);
  res.json({ report, answer });
};

const sendReport = async (jsonFile) => {
  const response = await fetch(`${process.env.API_URL}/report`, {
    method: "POST",
    body: JSON.stringify(jsonFile),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json();
};

const getJsonFile = async () => {
  const responseJsonFile = await fetch(
    `${process.env.API_URL}/data/${process.env.API_KEY}/json.txt`
  );
  const jsonFile = await responseJsonFile.text();
  const parsedJsonFile = JSON.parse(jsonFile);
  const testData = await correctJsonFile(parsedJsonFile);
  parsedJsonFile["test-data"] = testData;
  parsedJsonFile["apikey"] = process.env.API_KEY;
  return parsedJsonFile;
};

const correctJsonFile = async (jsonFile) => {
  let badAnswers = 0;
  let i = 0;
  const testData = jsonFile["test-data"];
  while (i < testData.length) {
    if (eval(testData[i].question) !== testData[i].answer) {
      badAnswers++;
      testData[i].answer = eval(testData[i].question);
    }
    if (testData[i]["test"]) {
      const question = testData[i]["test"]["q"];
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: correctJsonFilePrompt },
          { role: "user", content: question },
        ],
      });
      testData[i]["test"]["a"] = response.choices[0].message.content;
    }

    i++;
  }
  return testData;
};
