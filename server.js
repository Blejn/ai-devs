import express from "express";
import dotenv from "dotenv";
import { conversationWithAgent } from "./tasks/task2/task2.js";
import { convertJsonFile } from "./tasks/task3/taks3.js";
import { censorship } from "./tasks/task5/task5.js";
import { getFiles } from "./tasks/task6/task6.js";
import { getCityName } from "./tasks/task7/task7.js";
import { sendReport } from "./tasks/task8/task8.js";
import { sendSeparateDifferentThemes } from "./tasks/task9/task9.js";
const app = express();
app.use(express.json());
dotenv.config();
const port = 3000;

app.get("/", (req, res) => {
  console.log("Hello World!");
  res.send("Hello World!");
});
/*
app.post("/openai", async (req, res) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: req.body.text },
      ],
    });
    res.send(`Otrzymano: ${response.choices[0].message.content}`);
  } catch (error) {
    console.error(error);
  }
  console.log(response.choices[0].message.content);
});

const fetchData = async () => {
  return new Promise((resolve, reject) => {
    https
      .get("https://poligon.aidevs.pl/dane.txt", (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          resolve(data);
        });
      })
      .on("error", (err) => {
        reject(err);
      });
  });
};

const sendData = async (tokens) => {
  const URL = "https://poligon.aidevs.pl/verify";
  const data = JSON.stringify({
    task: "POLIGON",
    apikey: process.env.OPENAI_API_KEY,
    answer: tokens,
  });

  const options = {
    hostname: "poligon.aidevs.pl",
    port: 443,
    path: "/verify",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": data.length,
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseBody = "";
      res.on("data", (chunk) => {
        responseBody += chunk;
      });
      res.on("end", () => {
        resolve(responseBody);
      });
    });

    req.on("error", (err) => {
      reject(err);
    });

    req.write(data);
    req.end();
  });
};

app.post("/send-tokens", async (req, res) => {
  try {
    const data = await fetchData();
    const tokens = data.split("\n");
    tokens.pop();
    const response = await sendData(tokens);
    console.log(response);
    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to fetch data");
  }
});
*/

//TASK 1 ------------------------------------------------------------
//app.post("/get-url-content", getUrlContent);
//END-TASK 1 ------------------------------------------------------------

//TASK 2 ------------------------------------------------------------
app.post("/conversation-with-agent", conversationWithAgent);
//END-TASK 2 ------------------------------------------------------------

//TASK 3 ------------------------------------------------------------
app.post("/convertJsonFile", convertJsonFile);
//END-TASK 3 ------------------------------------------------------------

//TASK 5 ------------------------------------------------------------
app.post("/censorship", censorship);
//END-TASK 5 ------------------------------------------------------------

//TASK 6 ------------------------------------------------------------
app.post("/get-files", (req, res) => {
  res.json({ status: "processing", message: "Transkrypcja w toku..." });
  getFiles().then((result) => {
    console.log("Transkrypcja zakończona:", result);
  });
});
//END-TASK 6 ------------------------------------------------------------

//TASK 7 ------------------------------------------------------------
app.get("/get-city", (req, res) => {
  res.json({ status: "processing", message: "Interpretacja w toku..." });
  getCityName().then((result) => {
    console.log("Interpretacja zakończona:", result);
  });
});
//END-TASK 7 ------------------------------------------------------------

//TASK 8 ------------------------------------------------------------
app.get("/robotid", (req, res) => {
  res.json({ status: "processing", message: "Robotid w toku..." });
  sendReport().then((result) => {
    console.log("Robotid zakończony:", result);
  });
});
//END-TASK 8 ------------------------------------------------------------

//TASK 9 ------------------------------------------------------------
app.get("/separate-different-themes", (req, res) => {
  res.json({
    status: "processing",
    message: "Separate different themes w toku...",
  });
  sendSeparateDifferentThemes().then((result) => {
    console.log("Separate different themes zakończony:", result);
  });
});
//END-TASK 9 ------------------------------------------------------------

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
