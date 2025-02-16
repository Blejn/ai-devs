export const conversationWithAgent = async (req, res) => {
  const conversation = [];
  const response = await startConversation();
  console.log("response", response);
  conversation.push({ role: "user", content: response.text });
  await repeatConversation(response.text, response.msgID, conversation);
  res.send(conversation);
};

const startConversation = async () => {
  const response = await fetch("https://xyz.ag3nts.org/verify", {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({
      text: "READY",
      msgID: 0,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const body = await response.json();
  return body;
};

const repeatConversation = async (question, msgID, conversation) => {
  let attempts = 0;
  let isComplete = false;
  let response;
  let answars = [];

  while (!isComplete && attempts < 4) {
    console.log(`question + ${attempts.length + 1}`, question);
    const answer = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: talkToAgentPrompt },
        { role: "user", content: question },
      ],
    });
    console.log(
      `answer + ${attempts.length + 1}`,
      answer.choices[0].message.content
    );
    console.log("text", answer.choices[0].message.content);
    console.log("msgID", msgID);

    response = await fetch("https://xyz.ag3nts.org/verify", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        text: answer.choices[0].message.content,
        msgID: msgID,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(`response + ${attempts.length + 1}`, response);

    const responseData = await response.json();
    console.log(`responseData + ${attempts.length + 1}`, responseData);

    conversation.push({ role: "assistant", content: responseData.text });

    if (responseData.text === "OK") {
      isComplete = true;
    }

    attempts++;
    question = responseData.text;
  }

  answars.push(responseData.text);

  return response;
};
