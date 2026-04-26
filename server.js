const express = require('express');
const app = express();
app.use(express.json());

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

function stripMarkdown(text) {
  return text
    .replace(/#{1,6}\s*/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

app.post('/chat', async (req, res) => {
  const { message, system, messages } = req.body;

  let messageArray;
  if (messages && Array.isArray(messages)) {
    messageArray = messages;
  } else {
    messageArray = [{ role: "user", content: message || "hello" }];
  }

  const systemPrompt = system || "Kau adalah pemandu pelancong warisan Melaka. Jawab dalam Bahasa Melayu yang sopan dan menarik. Jangan guna markdown, heading, atau simbol bold. Tulis dalam ayat biasa sahaja.";

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 600,
        system: systemPrompt,
        messages: messageArray
      })
    });

    const data = await response.json();

    if (data.content && data.content[0]) {
      const cleaned = stripMarkdown(data.content[0].text);
      res.json({ reply: cleaned });
    } else {
      console.log("Claude error:", JSON.stringify(data));
      res.status(500).json({ reply: "Maaf, sistem sedang bermasalah." });
    }
  } catch (err) {
    console.log("Server error:", err);
    res.status(500).json({ reply: "Maaf, terdapat ralat teknikal." });
  }
});

app.listen(3000, () => console.log('NPC Proxy Server ON - port 3000'));