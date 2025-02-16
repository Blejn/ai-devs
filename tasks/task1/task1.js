import { crawlResponse } from "../../firecrawl.js";
import { openai } from "../../utils/openai.js";
import { answerTheQuestionPrompt } from "../../prompts/prompts.js";

export const getUrlContent = async (req, res) => {
  const response = crawlResponse;
  console.log("response", response.data[0].html);
  const question = response.data[0].html
    .match(/<p id="human-question">(.*?)<\/p>/)[1]
    .replace("Question:<br>", "");

  if (question) {
    console.log(question);
    res.send(question);
    const answerResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: answerTheQuestionPrompt,
        },
        { role: "user", content: question },
      ],
    });
    const answer = answerResponse.choices[0].message.content;
    console.log("answer", answer);
    if (answer !== "") {
      const data = {
        username: "tester",
        password: "574e112a",
        answer: parseInt(answer, 10),
      };
      const response = await sendRequest(data);

      if (!response.ok) {
        throw new Error(`Błąd podczas wysyłania: ${response.status}`);
      }
      const body = await response.body;
      console.log("body", body);
      const bodyText = await response.text();
      console.log("bodyText", bodyText);
    } else {
      res.send("No answer found");
    }
  } else {
    res.send("No question found");
  }
};

const sendRequest = async (data) => {
  console.log("data", data);
  const response = await fetch("https://xyz.ag3nts.org", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cache-Control": "no-cache",
    },
    body: new URLSearchParams({
      username: data.username,
      password: data.password,
      answer: data.answer,
    }),
  });
  return response;
};
